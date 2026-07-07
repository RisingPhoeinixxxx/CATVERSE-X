from app.security import hash_password
from app.security import verify_password

password = "Cat123"

hashed = hash_password(password)

print(hashed)

print(
    verify_password(
        password,
        hashed
    )
)