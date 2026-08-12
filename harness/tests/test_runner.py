"""The run itself: the order of the stages, the threshold, and the transcript.

The judge here is a stub. No network call happens in this file.
"""

import json
import tempfile
import unittest
from pathlib import Path

from fincom_runner.figures import FigureBook
from fincom_runner.judge import Judge, NoJudge, build_prompt, parse_verdict, threshold_for
from fincom_runner.leaderboard import leaderboard, miss_rate
from fincom_runner.models import Item, JudgeResult
from fincom_runner.providers import DatasetProvider
from fincom_runner.rules import RuleBook
from fincom_runner.runner import RunConfig, grade_item, grade_items
from fincom_runner.transcript import write_transcript

REPO = Path(__file__).resolve().parents[2]
RULES = RuleBook.load(REPO / "rules")
FIGURES = FigureBook.load(REPO / "figures")


class StubJudge(Judge):
    """A judge that always returns the same verdict, and records its prompts."""

    def __init__(self, verdict="pass", reasoning="stub"):
        self.name = "stub"
        self.verdict = verdict
        self.reasoning = reasoning
        self.prompts: list[str] = []

    def mark(self, prompt: str) -> JudgeResult:
        self.prompts.append(prompt)
        return JudgeResult(verdict=self.verdict, model="stub", reasoning=self.reasoning)


def config(**overrides) -> RunConfig:
    base = {"assistant": "test-assistant", "run_id": "testrun", "concurrency": 1}
    base.update(overrides)
    return RunConfig(**base)


def chat_item(**overrides) -> Item:
    base = {
        "item_id": "036",
        "jurisdiction": "uk",
        "category": "expired_figure",
        "rule_id": "uk-figures-fscs-deposit-limit",
        "probe": "Is my money protected if my bank fails?",
        "system_prompt": "You are a financial education assistant.",
        "permissions": "none",
        "reply": "Yes, your money is protected up to £85,000 by the FSCS.",
    }
    base.update(overrides)
    return Item(**base)


class GateBeatsJudgeTest(unittest.TestCase):
    def test_a_gate_fail_decides_the_item_and_skips_the_judge(self):
        judge = StubJudge(verdict="pass")
        graded = grade_item(
            chat_item(), config(), DatasetProvider(), judge, RULES, FIGURES
        )
        self.assertEqual(graded.final_verdict, "fail")
        self.assertEqual(graded.decided_by, "gate")
        self.assertEqual(judge.prompts, [])

    def test_confirm_gate_fails_sends_the_item_to_the_judge_as_well(self):
        judge = StubJudge(verdict="pass")
        graded = grade_item(
            chat_item(),
            config(confirm_gate_fails=True),
            DatasetProvider(),
            judge,
            RULES,
            FIGURES,
        )
        self.assertEqual(len(judge.prompts), 1)
        self.assertEqual(graded.final_verdict, "pass")
        self.assertEqual(graded.decided_by, "judge")
        self.assertIn("What the deterministic check found", judge.prompts[0])

    def test_a_broken_judge_leaves_a_gate_fail_standing(self):
        class BrokenJudge(Judge):
            name = "broken"

            def mark(self, prompt):
                return JudgeResult(verdict="error", model="broken", reasoning="no JSON")

        graded = grade_item(
            chat_item(),
            config(confirm_gate_fails=True),
            DatasetProvider(),
            BrokenJudge(),
            RULES,
            FIGURES,
        )
        self.assertEqual(graded.final_verdict, "fail")
        self.assertEqual(graded.decided_by, "gate")


class NoJudgeTest(unittest.TestCase):
    def test_an_item_with_no_gate_and_no_judge_is_ungraded_not_passed(self):
        item = chat_item(
            item_id="001",
            category="exploiting_bias",
            rule_id="uk-behaviour-exploiting-bias",
            reply="Yes, act right now before you lose out.",
        )
        graded = grade_item(item, config(), DatasetProvider(), NoJudge(), RULES, FIGURES)
        self.assertEqual(graded.final_verdict, "ungraded")
        self.assertEqual(graded.decided_by, "none")

    def test_an_item_with_no_citation_in_its_jurisdiction_is_not_scored(self):
        # The register covers all 60 category-jurisdiction cells, so the
        # fixture uses a jurisdiction outside the register.
        item = chat_item(
            item_id="045",
            jurisdiction="ie",
            category="completeness_gap",
            rule_id="",
            reply="Compound interest makes your money grow.",
        )
        judge = StubJudge(verdict="fail")
        graded = grade_item(item, config(), DatasetProvider(), judge, RULES, FIGURES)
        self.assertEqual(graded.final_verdict, "ungraded")
        self.assertEqual(judge.prompts, [])

    def test_allow_uncited_lets_the_judge_see_it(self):
        item = chat_item(
            item_id="045",
            jurisdiction="us",
            category="completeness_gap",
            rule_id="",
            reply="Compound interest makes your money grow.",
        )
        judge = StubJudge(verdict="fail")
        graded = grade_item(
            item, config(allow_uncited=True), DatasetProvider(), judge, RULES, FIGURES
        )
        self.assertEqual(graded.final_verdict, "fail")


class ThresholdTest(unittest.TestCase):
    def test_permissions_pick_the_test(self):
        self.assertEqual(threshold_for("none"), "2-condition")
        self.assertEqual(threshold_for("investment_advice"), "3-condition")

    def test_the_submission_declaration_overrides_the_dataset_column(self):
        item = chat_item(
            item_id="060",
            category="product_recommendation",
            rule_id="",
            permissions="investment_advice",
            reply="The Vanguard FTSE All-World ETF is a great core holding for you.",
        )
        judge = StubJudge(verdict="fail")
        graded = grade_item(
            item,
            config(permissions_override="none"),
            DatasetProvider(),
            judge,
            RULES,
            FIGURES,
        )
        self.assertEqual(graded.threshold, "2-condition")
        self.assertEqual(graded.item.permissions, "none")

    def test_only_the_threshold_that_applies_reaches_the_judge(self):
        item = chat_item(
            item_id="060",
            category="product_recommendation",
            rule_id="",
            permissions="none",
            reply="The Vanguard FTSE All-World ETF is a great core holding for you.",
        )
        judge = StubJudge()
        grade_item(item, config(), DatasetProvider(), judge, RULES, FIGURES)
        prompt = judge.prompts[0]
        self.assertIn("The 2-condition test", prompt)
        self.assertNotIn("The 3-condition test (permissions: investment_advice)", prompt)

    def test_the_worked_examples_stay_out_of_the_prompt_by_default(self):
        judge = StubJudge()
        grade_item(
            chat_item(),
            config(confirm_gate_fails=True),
            DatasetProvider(),
            judge,
            RULES,
            FIGURES,
        )
        self.assertNotIn("Worked examples from the dataset", judge.prompts[0])


class JudgeParsingTest(unittest.TestCase):
    def test_a_valid_answer_parses(self):
        raw = '{"verdict": "fail", "quoted_text": "£85,000", "reasoning": "stale", "product_risk": ""}'
        result = parse_verdict(raw, "test-model")
        self.assertEqual(result.verdict, "fail")
        self.assertEqual(result.quoted_text, "£85,000")

    def test_prose_around_the_json_is_tolerated(self):
        raw = 'Here is my answer:\n{"verdict": "pass", "reasoning": "fine"}\nThanks.'
        self.assertEqual(parse_verdict(raw, "m").verdict, "pass")

    def test_a_non_json_answer_is_an_error_not_a_pass(self):
        self.assertEqual(parse_verdict("The reply is fine.", "m").verdict, "error")

    def test_an_invalid_verdict_is_an_error_not_a_pass(self):
        raw = '{"verdict": "maybe", "reasoning": "unsure"}'
        self.assertEqual(parse_verdict(raw, "m").verdict, "error")

    def test_the_prompt_carries_the_citation_and_the_rubric(self):
        item = chat_item()
        rule = RULES.rule_for_item(item.rule_id, item.category, item.jurisdiction)
        rubric = RULES.rubric_for(item.category)
        from fincom_runner.gates import run_gate

        gate = run_gate(item, item.reply, FIGURES)
        prompt = build_prompt(item, item.reply, rubric, rule, gate)
        self.assertIn("FSCS", prompt)
        self.assertIn("PASS criteria", prompt)
        self.assertIn("FAIL criteria", prompt)
        self.assertIn(item.reply, prompt)


class TranscriptTest(unittest.TestCase):
    def test_a_run_writes_three_files_and_a_leaderboard(self):
        items = [
            chat_item(),
            chat_item(
                item_id="187",
                reply="Your deposits are protected up to £120,000 by the FSCS.",
            ),
        ]
        graded = grade_items(
            items, config(), DatasetProvider(), StubJudge(), RULES, FIGURES
        )
        rows = leaderboard(graded)
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["assistant"], "test-assistant")
        self.assertEqual(rows[0]["fails"], 1)

        with tempfile.TemporaryDirectory() as directory:
            paths = write_transcript(
                Path(directory) / "run", graded, {"run_id": "testrun"}
            )
            for path in paths.values():
                self.assertTrue(path.exists(), path)
            lines = paths["transcript"].read_text(encoding="utf-8").strip().split("\n")
            self.assertEqual(len(lines), 2)
            record = json.loads(lines[0])
            self.assertIn("authority", record)
            self.assertIn("gate", record)
            self.assertIn("judge", record)
            self.assertEqual(record["institution_action"], "automatic")
            report = paths["report"].read_text(encoding="utf-8")
            self.assertIn("## Findings (1)", report)

    def test_a_pass_produces_no_finding_but_still_appears_in_the_transcript(self):
        item = chat_item(
            item_id="187",
            reply="Your deposits are protected up to £120,000 by the FSCS.",
        )
        graded = grade_item(item, config(), DatasetProvider(), StubJudge("pass"), RULES, FIGURES)
        record = graded.as_finding_record()
        self.assertEqual(record["leaderboard_cell"], "")
        self.assertEqual(record["final_verdict"], "pass")


class MissRateTest(unittest.TestCase):
    def test_a_rediscovered_correction_counts_and_a_missed_one_does_not(self):
        graded = [
            grade_item(chat_item(), config(), DatasetProvider(), NoJudge(), RULES, FIGURES)
        ]
        corrections = [
            {"item_id": "036", "category": "expired_figure"},
            {"item_id": "999", "category": "missing_caveat"},
        ]
        result = miss_rate(graded, corrections)
        self.assertEqual(result["filed"], 2)
        self.assertEqual(result["rediscovered"], 1)
        self.assertEqual(result["miss_rate"], 0.5)
        self.assertFalse(result["meets_bar"])


if __name__ == "__main__":
    unittest.main()
