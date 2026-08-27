from maths_ai_ecosystem.core.entropy_engine import EntropyEngine


def kolmogorov_proxy(text: str) -> float:
    return EntropyEngine().kolmogorov_proxy(text)


def mdl(model_bits: float, error_bits: float) -> float:
    return EntropyEngine().minimum_description_length(model_bits, error_bits)
