from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import RegisterView, LoginView, LogoutView, TwoFactorAuthView, UserProfileView, UserProfileUpdateView, UserPlayersView, UserFriendsView, FriendsListView, RemoveFriendView, UploadMatchView, MatchDataView, oauth2_callback

urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/2fa/', TwoFactorAuthView.as_view(), name='2fa'),
    path('api/settings/', UserProfileView.as_view(), name='user-profile'),
    path('api/update-settings/', UserProfileUpdateView.as_view(), name='user-profile-update'),
    path('api/players/', UserPlayersView.as_view(), name='players'),
    path("api/add-friend/", UserFriendsView.as_view(), name="add-friend"),
    path("api/friends/", FriendsListView.as_view(), name="friends"),
    path('api/friends/<int:friend_id>/', RemoveFriendView.as_view(), name='remove-friend'),
    path('api/upload-match/', UploadMatchView.as_view(), name='upload-match'),
    path('api/match-data/', MatchDataView.as_view(), name='match_data'),
    path('auth/', include('social_django.urls', namespace='social')),
    path('auth/complete/42/', oauth2_callback, name='oauth2_callback'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)