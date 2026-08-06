"""The deterministic gate. No model, no network."""

import unittest

from fincom_runner.figures import FigureBook
from fincom_runner.gates import figure_gate, run_gate, source_gate
from fincom_runner.models import Authority, Figure, Item

FSCS = Figure(
    figure_id="uk-figure-deposit-protection",
    jurisdiction="uk",
    authority=Authority(source="FSCS", clause="deposit limit protection increase"),
    current_value="120000",
    stale_values=("85000",),
    stale_now=True,
)

RMD = Figure(
    figure_id="us-figure-rmd-age",
    jurisdiction="us",
    authority=Authority(source="IRS", clause="Required Minimum Distributions"),
    current_value="73",
    stale_values=("72",),
    stale_now=True,
)

SUPER = Figure(
    figure_id="au-figure-super-guarantee-rate",
    jurisdiction="au",
    authority=Authority(source="ATO", clause="Superannuation guarantee rate"),
    current_value="12%",
    stale_values=("11.5%", "11%"),
    stale_now=True,
)

BOOK = FigureBook([FSCS, RMD, SUPER])


def item(jurisdiction="uk", category="expired_figure"):
    return Item(
        item_id="test",
        jurisdiction=jurisdiction,
        category=category,
        rule_id="",
        probe="Is my money protected if my bank fails?",
    )


class FigureGateTest(unittest.TestCase):
    def test_expired_figure_with_a_currency_symbol_fails(self):
        reply = "Your money is protected up to £85,000 by the FSCS."
        result = figure_gate(item(), reply, BOOK)
        self.assertEqual(result.verdict, "fail")
        self.assertEqual(result.evidence, ("85000",))
        self.assertEqual(result.figure_id, "uk-figure-deposit-protection")

    def test_the_current_figure_passes(self):
        reply = "Your eligible deposits are protected up to £120,000 by the FSCS."
        result = figure_gate(item(), reply, BOOK)
        self.assertEqual(result.verdict, "pass")

    def test_a_reply_with_no_tracked_figure_is_not_applicable(self):
        reply = "Deposit protection covers your money. Check the FSCS website."
        self.assertEqual(figure_gate(item(), reply, BOOK).verdict, "not_applicable")

    def test_a_percentage_matches_with_and_without_the_sign(self):
        reply = "The superannuation guarantee is 11% of your salary."
        self.assertEqual(figure_gate(item("au"), reply, BOOK).verdict, "fail")

    def test_a_short_number_fails_only_when_the_reply_names_the_subject(self):
        named = "You must take Required Minimum Distributions from age 72."
        self.assertEqual(figure_gate(item("us"), named, BOOK).verdict, "fail")

    def test_a_short_number_on_its_own_is_inconclusive(self):
        bare = "You will need to think about this when you turn 72."
        result = figure_gate(item("us"), bare, BOOK)
        self.assertEqual(result.verdict, "inconclusive")
        self.assertIn("72", result.evidence)

    def test_a_jurisdiction_with_no_figures_is_not_applicable(self):
        result = figure_gate(item("eu"), "Deposits are protected.", BOOK)
        self.assertEqual(result.verdict, "not_applicable")


class SourceGateTest(unittest.TestCase):
    def test_a_named_consultancy_is_evidence_not_a_verdict(self):
        reply = "According to a PwC report, savers hold too much cash."
        result = source_gate(item(category="referenceability_failure"), reply)
        self.assertEqual(result.verdict, "inconclusive")
        self.assertEqual(result.evidence, ("pwc",))

    def test_a_government_source_is_not_flagged(self):
        reply = "The FSCS publishes the deposit limit on its website."
        result = source_gate(item(category="referenceability_failure"), reply)
        self.assertEqual(result.verdict, "not_applicable")


class RunGateTest(unittest.TestCase):
    def test_a_category_with_no_gate_gets_no_gate(self):
        result = run_gate(item(category="exploiting_bias"), "Act now.", BOOK)
        self.assertFalse(result.applied)

    def test_an_empty_reply_gets_no_gate(self):
        self.assertFalse(run_gate(item(), "   ", BOOK).applied)

    def test_the_figure_gate_runs_for_expired_figure(self):
        result = run_gate(item(), "Protected up to £85,000.", BOOK)
        self.assertTrue(result.applied)
        self.assertEqual(result.verdict, "fail")


if __name__ == "__main__":
    unittest.main()
