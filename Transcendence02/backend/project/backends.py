import requests
from social_core.backends.oauth import BaseOAuth2

class FourtyTwoOAuth2(BaseOAuth2):
    name = '42'
    AUTHORIZATION_URL = 'https://api.intra.42.fr/oauth/authorize'
    ACCESS_TOKEN_URL = 'https://api.intra.42.fr/oauth/token'
    ACCESS_TOKEN_METHOD = 'POST'
    DEFAULT_SCOPE = ['public']
    REDIRECT_STATE = True

    def get_user_details(self, response):
        return {
            'username': response.get('login'),
            'email': response.get('email'),
            'fullname': response.get('displayname'),
        }

    def user_data(self, access_token, *args, **kwargs):
        # Use the access token to fetch user data from the API
        response = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'})
        return response.json()