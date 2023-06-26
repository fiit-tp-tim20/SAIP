from django.contrib.auth.models import User

from rest_framework import serializers, validators

from datetime import datetime, timezone

from .models import Game, Company, Production, Marketing, Factory, CompaniesState, Turn

from rest_framework import status


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, required=True, allow_blank=False,
                                     style={'input_type': 'password'}, trim_whitespace=False)
    username = serializers.CharField(required=True, allow_blank=False,
                                     validators=[validators.UniqueValidator(queryset=User.objects.all())])

    class Meta:
        model = User
        fields = ('username', 'password', 'date_joined')

    def create(self, validated_data) -> User:
        username = validated_data.get('username')
        password = validated_data.get('password')
        created_at = datetime.now(timezone.utc)

        user = User.objects.create(
            username=username,
            date_joined=created_at
        )
        user.set_password(password)
        user.save()

        return user


class GameSerializer(serializers.ModelSerializer):
    """Serializer for game creation"""

    name = serializers.CharField(required=True, allow_blank=False,
                                 validators=[validators.UniqueValidator(queryset=Game.objects.all())])
    turns = serializers.IntegerField(required=True)

    class Meta:
        model = Game
        fields = ('name', 'turns')

    def create(self, validated_data) -> Game:
        name = validated_data.get('name')
        turns = validated_data.get('turns')

        game = Game.objects.create(
            name=name,
            turns=turns
        )
        game.save()

        return game


class CompanySerializer(serializers.ModelSerializer):
    """Serializer for company creation"""

    name = serializers.CharField(required=True, allow_blank=False)
    game = serializers.PrimaryKeyRelatedField(queryset=Game.objects.filter(end__isnull=True))
    participants = serializers.CharField(required=True, allow_blank=False)
    class Meta:
        model = Company
        fields = ('game', 'name', 'participants')

    def create(self, validated_data) -> Company:
        name = validated_data.get('name')
        game = validated_data.get('game')
        participants = validated_data.get('participants')

        game_turn = Turn.objects.filter(game=game, end__isnull=True).order_by('-number').first().number

        if game_turn != 0:
            raise serializers.ValidationError({"detail": "Game has already started"})

        if name in [c.name for c in Company.objects.filter(game=game)]:
            err = serializers.ValidationError({"detail": "Company with this name already exists in specified game"})
            err.status_code = status.HTTP_409_CONFLICT
            raise err

        company = Company.objects.create(
            name=name,
            game=game,
            participants=participants
        )
        company.save()

        return company


class SpendingsSerializer(serializers.Serializer):
    """Serializer for company spendings layout (does not have any methods)"""

    marketing = serializers.JSONField(required=True)
    production = serializers.JSONField(required=True)
    factory = serializers.JSONField(required=True)
    brakes = serializers.IntegerField(min_value=0, required=False)
    frame = serializers.IntegerField(min_value=0, required=False)
    battery = serializers.IntegerField(min_value=0, required=False)
    display = serializers.IntegerField(min_value=0, required=False)


class ProductionSerializer(serializers.ModelSerializer):
    """Serializer for production update (needs already existing instance)"""

    sell_price = serializers.FloatField(required=True, min_value=0)
    volume = serializers.IntegerField(required=True, min_value=0)
    class Meta:
        model = Production
        fields = ('sell_price', 'volume')

    def update(self, instance, validated_data) -> Production:
        sell_price = validated_data.get('sell_price')
        volume = validated_data.get('volume')

        instance.sell_price = sell_price
        instance.volume = volume

        return instance

class MaketingSerializer(serializers.ModelSerializer):
    """Serializer for marketing update (needs already existing instance)"""

    viral = serializers.IntegerField(required=True, min_value=0)
    podcast = serializers.IntegerField(required=True, min_value=0)
    ooh = serializers.IntegerField(required=True, min_value=0)
    tv = serializers.IntegerField(required=True, min_value=0)
    billboard = serializers.IntegerField(required=True, min_value=0)
    class Meta:
        model = Marketing
        fields = ('viral', 'podcast', 'ooh', 'tv', 'billboard')

    def update(self, instance, validated_data) -> Marketing:
        viral = validated_data.get('viral')
        podcast = validated_data.get('podcast')
        ooh = validated_data.get('ooh')
        tv = validated_data.get('tv')
        billboard = validated_data.get('billboard')


        instance.viral = viral
        instance.podcast = podcast
        instance.ooh = ooh
        instance.tv = tv
        instance.billboard = billboard

        return instance

class FactorySerializer(serializers.ModelSerializer):
    """Serializer for factory update (needs already existing instance)"""

    capital = serializers.IntegerField(required=True, min_value=0)
    class Meta:
        model = Factory
        fields = ('capital', )

    def update(self, instance, validated_data) -> Factory:
        capital = validated_data.get('capital')

        instance.capital = capital

        return instance
