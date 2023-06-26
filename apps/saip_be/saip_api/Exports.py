import csv
import io
import zipfile
from zipfile import ZipFile

from .models import Game, Turn, MarketState, Company, CompaniesState


def create_game_export(game: Game) -> io.BytesIO:
    """Creates a zip file containing all the data for a game split into 2 csv files."""
    f = io.BytesIO()

    companies_export, market_export = io.StringIO(), io.StringIO()
    companies_writer, market_writer = csv.writer(companies_export), csv.writer(market_export)
    companies_writer.writerow(['turn', 'name', 'man_cost', 'sell_price', 'volume', 'marketing_viral',
                               'marketing_podcast', 'marketing_ooh', 'marketing_tv', 'marketing_billboard',
                               'factory_capacity', 'factory_capital', 'factory_capital_investments',
                               'r_d', 'cash', 'inventory', 'orders_received', 'orders_fulfilled',
                               'ret_earnings', 'net_profit', 'cash_flow_res', 'stock_price'])

    market_writer.writerow(['turn', 'sold', 'demand', 'inventory', 'manufactured', 'capacity'])

    companies = Company.objects.filter(game=game)

    for turn in Turn.objects.filter(game=game, end__isnull=False):
        ms = MarketState.objects.get(turn=turn)
        market_writer.writerow([turn.number, ms.sold, ms.demand, ms.inventory, ms.manufactured, ms.capacity])

        for company in companies:
            cs = CompaniesState.objects.get(turn=turn, company=company)
            prod, mark, fact = cs.production, cs.marketing, cs.factory
            companies_writer.writerow([turn.number, company.name, prod.man_cost, prod.sell_price, prod.volume,
                                       mark.viral, mark.podcast, mark.ooh, mark.tv, mark.billboard,
                                       fact.capacity, fact.capital, fact.capital_investments,
                                       cs.r_d, cs.cash, cs.inventory, cs.orders_received, cs.orders_fulfilled,
                                       cs.ret_earnings, cs.net_profit, cs.cash_flow_res, cs.stock_price])

    with ZipFile(f, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        zip_file.writestr('companies.csv', companies_export.getvalue())
        zip_file.writestr('market.csv', market_export.getvalue())

    return f
