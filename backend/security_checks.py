def check_password_strength(password: str) -> dict:
    length_ok = len(password) >= 8
    has_upper = any(char.isupper() for char in password)
    has_lower = any(char.islower() for char in password)
    has_digit = any(char.isdigit() for char in password)
    has_special = any(not char.isalnum() for char in password)

    score = sum([
        length_ok,
        has_upper,
        has_lower,
        has_digit,
        has_special
    ])

    if score <= 2:
        strength = "Weak"
    elif score <= 4:
        strength = "Medium"
    else:
        strength = "Strong"

    return {
        "strength": strength,
        "score": score,
        "checks": {
            "minimum_length": length_ok,
            "uppercase": has_upper,
            "lowercase": has_lower,
            "number": has_digit,
            "special_character": has_special
        }
    }
