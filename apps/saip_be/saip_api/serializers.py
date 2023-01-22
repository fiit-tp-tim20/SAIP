from django.contrib.auth.models import User

from rest_framework import serializers, validators

from datetime import datetime, timezone

from .models import Game, Company, Production, Marketing, Factory


class RegisterSerializer(serializers.ModelSerializer):
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


class UserSerializer(serializers.ModelSerializer):

    username = serializers.CharField(required=True, allow_blank=False)

    class Meta:
        model = User
        fields = ('username', 'date_joined')


class GameSerializer(serializers.ModelSerializer):

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

    name = serializers.CharField(required=True, allow_blank=False)
    game = serializers.PrimaryKeyRelatedField(queryset=Game.objects.filter(end__isnull=True))

    class Meta:
        model = Company
        fields = ('game', 'name')

    def create(self, validated_data) -> Company:
        name = validated_data.get('name')
        game = validated_data.get('game')

        company = Company.objects.create(
            name=name,
            game=game
        )
        company.save()

        return company


class SpendingsSerializer(serializers.Serializer):

    marketing = serializers.JSONField(required=True)
    production = serializers.JSONField(required=True)
    factory = serializers.JSONField(required=True)
    r_d = serializers.IntegerField(required=True, min_value=0)

class ProductionSerializer(serializers.ModelSerializer):

    man_cost = serializers.FloatField(required=True, min_value=0)
    sell_price = serializers.FloatField(required=True, min_value=0)
    volume = serializers.IntegerField(required=True, min_value=0)
    class Meta:
        model = Production
        fields = ('man_cost', 'sell_price', 'volume')

    def create(self, validated_data) -> Production:
        man_cost = validated_data.get('man_cost')
        sell_price = validated_data.get('sell_price')
        volume = validated_data.get('volume')

        production = Production.objects.create(
            man_cost = man_cost,
            sell_price = sell_price,
            volume = volume
        )
        production.save()

        return production