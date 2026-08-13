"""The prompt builder, and the rebuilt benchmark datasets."""

import json
import unittest
from pathlib import Path

from fincom_runner.dataset import load_chat_items
from fincom_runner.prompts import (
    JURISDICTIONS,
    VARIANTS,
    PromptError,
    build_system_prompt,
    legacy_variant,
)

REPO = Path(__file__).resolve().parents[2]
MARKER = "Deployment configuration: "


def config_of(prompt: str) -> dict:
    """Parse the JSON object out of a rendered prompt."""
    return json.loads(prompt.split(MARKER, 1)[1])


class BuilderTest(unittest.TestCase):
    def test_the_prompt_carries_a_json_deployment_configuration(self):
        prompt = build_system_prompt("uk", "none", "baseline")
        config = config_of(prompt)
        self.assertEqual(config["jurisdiction"]["code"], "uk")
        self.assertEqual(config["jurisdiction"]["currency"], "GBP")
        self.assertEqual(config["operator"]["permissions"], [])
        self.assertFalse(config["operator"]["regulated"])
        self.assertFalse(config["capabilities"]["internet_access"])
        self.assertFalse(config["capabilities"]["can_execute_transactions"])
        self.assertEqual(config["conversation"]["history"], "none")

    def test_the_prompt_stays_on_one_line(self):
        for variant in VARIANTS:
            permissions = (
                "investment_advice" if variant == "regulated_adviser" else "none"
            )
            prompt = build_system_prompt("us", permissions, variant)
            self.assertNotIn("\n", prompt, variant)

    def test_the_regulated_variant_grants_the_permission(self):
        prompt = build_system_prompt("uk", "investment_advice", "regulated_adviser")
        config = config_of(prompt)
        self.assertTrue(config["operator"]["regulated"])
        self.assertEqual(config["operator"]["permissions"], ["investment_advice"])
        self.assertTrue(config["operator"]["may_give_personal_recommendations"])

    def test_a_permission_and_variant_that_disagree_are_an_error(self):
        with self.assertRaises(PromptError):
            build_system_prompt("uk", "investment_advice", "baseline")
        with self.assertRaises(PromptError):
            build_system_prompt("uk", "none", "regulated_adviser")

    def test_an_unknown_jurisdiction_or_variant_is_an_error(self):
        with self.assertRaises(PromptError):
            build_system_prompt("ie", "none", "baseline")
        with self.assertRaises(PromptError):
            build_system_prompt("uk", "none", "no_such_variant")


class LegacyVariantTest(unittest.TestCase):
    def test_the_v1_prose_prompts_map_to_variants(self):
        cases = {
            "for a regulated bank in the United Kingdom": "regulated_adviser",
            "You must not recommend a specific financial product": "strict_conduct",
            "Be warm and encouraging. Keep answers concise.": "warm",
            "Keep answers concise and check the member understands.": "check_understanding",
            "The member may share personal circumstances": "vulnerability",
            "If the member describes a behavioural pattern": "name_bias",
            "Keep answers clear, concise, and free of jargon.": "baseline",
            "Provide clear, helpful financial education. Keep answers concise.": "concise",
        }
        for text, expected in cases.items():
            self.assertEqual(legacy_variant(text), expected, text)

    def test_a_prompt_with_no_marker_is_an_error(self):
        with self.assertRaises(PromptError):
            legacy_variant("You are a generic assistant.")


class BenchmarkDatasetTest(unittest.TestCase):
    """Every benchmark row carries a configuration that agrees with its columns."""

    def check_file(self, name: str):
        items = load_chat_items(REPO / "datasets" / name)
        for item in items:
            self.assertIn(MARKER, item.system_prompt, item.item_id)
            config = config_of(item.system_prompt)
            self.assertEqual(
                config["jurisdiction"]["code"], item.jurisdiction, item.item_id
            )
            expected = [] if item.permissions == "none" else [item.permissions]
            self.assertEqual(
                config["operator"]["permissions"], expected, item.item_id
            )
            self.assertIn(
                config["jurisdiction"]["code"], JURISDICTIONS, item.item_id
            )

    def test_the_open_set(self):
        self.check_file("benchmark-open.csv")

    def test_the_holdout_set(self):
        self.check_file("benchmark-holdout.csv")

    def test_the_meta_eval_set(self):
        self.check_file("meta-eval.csv")


if __name__ == "__main__":
    unittest.main()
