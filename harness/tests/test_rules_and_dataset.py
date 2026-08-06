"""The loaders, read against the real rule files and the real datasets."""

import tempfile
import unittest
from pathlib import Path

from fincom_runner.dataset import DatasetError, load_chat_items, load_lesson_items
from fincom_runner.figures import FigureBook
from fincom_runner.models import ALL_CATEGORIES
from fincom_runner.rules import RuleBook, RuleError, parse_rule_file

REPO = Path(__file__).resolve().parents[2]


class RuleBookTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.book = RuleBook.load(REPO / "rules")

    def test_every_category_has_a_rule_file(self):
        self.assertEqual(set(self.book.categories()), set(ALL_CATEGORIES))

    def test_every_rule_carries_a_citation(self):
        for rule in self.book.rules.values():
            self.assertTrue(rule.authority.source, rule.rule_id)
            self.assertTrue(rule.authority.clause, rule.rule_id)

    def test_the_body_splits_into_pass_and_fail_sections(self):
        for category, rubric in self.book.rubrics.items():
            self.assertIn("PASS criteria", rubric.sections, category)
            self.assertIn("FAIL criteria", rubric.sections, category)

    def test_a_blank_rule_id_resolves_by_category_and_jurisdiction(self):
        rule = self.book.rule_for_item("", "exploiting_bias", "uk")
        self.assertIsNotNone(rule)
        self.assertEqual(rule.jurisdiction, "uk")
        self.assertEqual(rule.category, "exploiting_bias")

    def test_a_category_with_no_rule_in_a_jurisdiction_resolves_to_nothing(self):
        # docs/method.md: a rule with no citation for a jurisdiction must not be
        # scored there. `completeness_gap` cites the UK only.
        self.assertIsNone(self.book.rule_for_item("", "completeness_gap", "us"))

    def test_a_file_with_no_frontmatter_is_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "broken.md"
            path.write_text("# no frontmatter\n", encoding="utf-8")
            with self.assertRaises(RuleError):
                parse_rule_file(path)


class FigureBookTest(unittest.TestCase):
    def test_the_figures_load_and_some_are_gateable(self):
        book = FigureBook.load(REPO / "figures")
        self.assertGreater(len(book.figures), 0)
        self.assertGreater(len(book.gateable("uk")), 0)
        for figure in book.figures:
            self.assertTrue(figure.jurisdiction, figure.figure_id)


class DatasetTest(unittest.TestCase):
    def test_the_benchmark_set_loads_with_no_reply(self):
        items = load_chat_items(REPO / "fincom-bench" / "benchmark-public.csv")
        self.assertEqual(len(items), 191)
        self.assertTrue(all(item.reply == "" for item in items))
        self.assertTrue(all(item.category in ALL_CATEGORIES for item in items))

    def test_the_meta_eval_set_loads_with_a_reply(self):
        items = load_chat_items(REPO / "fincom-bench" / "dataset-v1.csv")
        self.assertEqual(len(items), 274)
        self.assertTrue(all(item.reply for item in items))

    def test_a_missing_column_is_an_error(self):
        with tempfile.NamedTemporaryFile("w", suffix=".csv", delete=False) as handle:
            handle.write("item_id,probe\n1,hello\n")
            path = Path(handle.name)
        self.addCleanup(path.unlink)
        with self.assertRaises(DatasetError):
            load_chat_items(path)

    def test_a_lesson_line_with_no_category_expands_to_the_lesson_axis(self):
        with tempfile.NamedTemporaryFile("w", suffix=".jsonl", delete=False) as handle:
            handle.write(
                '{"item_id": "slide-3", "jurisdiction": "uk", '
                '"lesson_id": "credit-unions", "slide": "3", '
                '"text": "Your money is protected up to 85,000 pounds."}\n'
            )
            path = Path(handle.name)
        self.addCleanup(path.unlink)
        items = load_lesson_items(path)
        self.assertEqual(len(items), 10)  # 7 compliance + 3 behaviour
        self.assertTrue(all(item.item_type == "lesson" for item in items))
        self.assertTrue(all(item.reply for item in items))


if __name__ == "__main__":
    unittest.main()
