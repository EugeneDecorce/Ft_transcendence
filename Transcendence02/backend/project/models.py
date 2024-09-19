from django.contrib.auth.models import AbstractUser
from django.db import models
import pyotp

class Match(models.Model):
    user = models.CharField(max_length=150)
    opponent = models.CharField(max_length=100)
    play_against_ai = models.BooleanField()
    player1_score = models.IntegerField()
    player2_score = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Match against {self.opponent} on {self.created_at}"

class User(AbstractUser):
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_groups',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions',
        blank=True
    )

    display_name = models.CharField(max_length=150, blank=True)
    security_answer_1 = models.CharField(max_length=255, blank=True)
    security_answer_2 = models.CharField(max_length=255, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

class Friendship(models.Model):
    user = models.ForeignKey(User, related_name="friendships", on_delete=models.CASCADE)
    friend = models.ForeignKey(User, related_name="friends", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "friend")