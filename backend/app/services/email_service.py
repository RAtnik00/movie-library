import smtplib
from email.message import EmailMessage

from app.core.config import Settings


class EmailService:
    def __init__(self, settings: Settings):
        self.settings = settings

    def send_password_reset_email(self, to_email: str, reset_url: str) -> None:
        message = EmailMessage()
        message["Subject"] = "Reset your Movie Library password"
        message["From"] = self.settings.SMTP_FROM_EMAIL
        message["To"] = to_email
        message.set_content(
            f"Hi,\n\n"
            f"Use this link to reset your password:\n"
            f"{reset_url}\n\n"
            f"If you did not request this, you can ignore this email."
        )

        with smtplib.SMTP_SSL(
            self.settings.SMTP_HOST,
            self.settings.SMTP_PORT,
        ) as smtp:
            smtp.login(
                self.settings.SMTP_USERNAME,
                self.settings.SMTP_PASSWORD,
            )
            smtp.send_message(message)
