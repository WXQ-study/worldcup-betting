"""Seed initial data for the 2026 World Cup"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base, SessionLocal
from app import models
from app.models import MatchStatus
from app.services.auth_service import hash_password
from datetime import datetime

Base.metadata.create_all(bind=engine)


def seed_teams():
    return [
        {"name": "Mexico", "name_cn": "墨西哥", "country_code": "MEX", "fifa_ranking": 15, "elo_rating": 1700, "group": "A"},
        {"name": "South Africa", "name_cn": "南非", "country_code": "RSA", "fifa_ranking": 66, "elo_rating": 1480, "group": "A"},
        {"name": "South Korea", "name_cn": "韩国", "country_code": "KOR", "fifa_ranking": 28, "elo_rating": 1620, "group": "A"},
        {"name": "Czech Republic", "name_cn": "捷克", "country_code": "CZE", "fifa_ranking": 39, "elo_rating": 1580, "group": "A"},
        {"name": "Canada", "name_cn": "加拿大", "country_code": "CAN", "fifa_ranking": 50, "elo_rating": 1520, "group": "B"},
        {"name": "Bosnia", "name_cn": "波黑", "country_code": "BIH", "fifa_ranking": 57, "elo_rating": 1520, "group": "B"},
        {"name": "Qatar", "name_cn": "卡塔尔", "country_code": "QAT", "fifa_ranking": 58, "elo_rating": 1480, "group": "B"},
        {"name": "Switzerland", "name_cn": "瑞士", "country_code": "SUI", "fifa_ranking": 12, "elo_rating": 1720, "group": "B"},
        {"name": "Brazil", "name_cn": "巴西", "country_code": "BRA", "fifa_ranking": 3, "elo_rating": 1980, "group": "C"},
        {"name": "Morocco", "name_cn": "摩洛哥", "country_code": "MAR", "fifa_ranking": 13, "elo_rating": 1750, "group": "C"},
        {"name": "Haiti", "name_cn": "海地", "country_code": "HAI", "fifa_ranking": 81, "elo_rating": 1400, "group": "C"},
        {"name": "Scotland", "name_cn": "苏格兰", "country_code": "SCO", "fifa_ranking": 30, "elo_rating": 1600, "group": "C"},
        {"name": "United States", "name_cn": "美国", "country_code": "USA", "fifa_ranking": 11, "elo_rating": 1720, "group": "D"},
        {"name": "Paraguay", "name_cn": "巴拉圭", "country_code": "PAR", "fifa_ranking": 56, "elo_rating": 1510, "group": "D"},
        {"name": "Australia", "name_cn": "澳大利亚", "country_code": "AUS", "fifa_ranking": 33, "elo_rating": 1580, "group": "D"},
        {"name": "Turkey", "name_cn": "土耳其", "country_code": "TUR", "fifa_ranking": 38, "elo_rating": 1620, "group": "D"},
        {"name": "Germany", "name_cn": "德国", "country_code": "GER", "fifa_ranking": 16, "elo_rating": 1800, "group": "E"},
        {"name": "Curacao", "name_cn": "库拉索", "country_code": "CUW", "fifa_ranking": 86, "elo_rating": 1380, "group": "E"},
        {"name": "Ivory Coast", "name_cn": "科特迪瓦", "country_code": "CIV", "fifa_ranking": 42, "elo_rating": 1570, "group": "E"},
        {"name": "Ecuador", "name_cn": "厄瓜多尔", "country_code": "ECU", "fifa_ranking": 32, "elo_rating": 1580, "group": "E"},
        {"name": "Netherlands", "name_cn": "荷兰", "country_code": "NED", "fifa_ranking": 6, "elo_rating": 1880, "group": "F"},
        {"name": "Japan", "name_cn": "日本", "country_code": "JPN", "fifa_ranking": 20, "elo_rating": 1650, "group": "F"},
        {"name": "Sweden", "name_cn": "瑞典", "country_code": "SWE", "fifa_ranking": 24, "elo_rating": 1630, "group": "F"},
        {"name": "Tunisia", "name_cn": "突尼斯", "country_code": "TUN", "fifa_ranking": 41, "elo_rating": 1520, "group": "F"},
        {"name": "Belgium", "name_cn": "比利时", "country_code": "BEL", "fifa_ranking": 5, "elo_rating": 1880, "group": "G"},
        {"name": "Egypt", "name_cn": "埃及", "country_code": "EGY", "fifa_ranking": 35, "elo_rating": 1600, "group": "G"},
        {"name": "Iran", "name_cn": "伊朗", "country_code": "IRN", "fifa_ranking": 21, "elo_rating": 1630, "group": "G"},
        {"name": "New Zealand", "name_cn": "新西兰", "country_code": "NZL", "fifa_ranking": 103, "elo_rating": 1400, "group": "G"},
        {"name": "Spain", "name_cn": "西班牙", "country_code": "ESP", "fifa_ranking": 8, "elo_rating": 1900, "group": "H"},
        {"name": "Cape Verde", "name_cn": "佛得角", "country_code": "CPV", "fifa_ranking": 64, "elo_rating": 1490, "group": "H"},
        {"name": "Saudi Arabia", "name_cn": "沙特阿拉伯", "country_code": "KSA", "fifa_ranking": 54, "elo_rating": 1500, "group": "H"},
        {"name": "Uruguay", "name_cn": "乌拉圭", "country_code": "URU", "fifa_ranking": 14, "elo_rating": 1750, "group": "H"},
        {"name": "France", "name_cn": "法国", "country_code": "FRA", "fifa_ranking": 2, "elo_rating": 2000, "group": "I"},
        {"name": "Senegal", "name_cn": "塞内加尔", "country_code": "SEN", "fifa_ranking": 18, "elo_rating": 1650, "group": "I"},
        {"name": "Iraq", "name_cn": "伊拉克", "country_code": "IRQ", "fifa_ranking": 62, "elo_rating": 1490, "group": "I"},
        {"name": "Panama", "name_cn": "巴拿马", "country_code": "PAN", "fifa_ranking": 45, "elo_rating": 1520, "group": "I"},
        {"name": "Argentina", "name_cn": "阿根廷", "country_code": "ARG", "fifa_ranking": 1, "elo_rating": 2050, "group": "J"},
        {"name": "Chile", "name_cn": "智利", "country_code": "CHI", "fifa_ranking": 43, "elo_rating": 1580, "group": "J"},
        {"name": "Vietnam", "name_cn": "越南", "country_code": "VIE", "fifa_ranking": 95, "elo_rating": 1350, "group": "J"},
        {"name": "Slovakia", "name_cn": "斯洛伐克", "country_code": "SVK", "fifa_ranking": 44, "elo_rating": 1570, "group": "J"},
        {"name": "England", "name_cn": "英格兰", "country_code": "ENG", "fifa_ranking": 4, "elo_rating": 1920, "group": "K"},
        {"name": "Colombia", "name_cn": "哥伦比亚", "country_code": "COL", "fifa_ranking": 10, "elo_rating": 1770, "group": "K"},
        {"name": "Algeria", "name_cn": "阿尔及利亚", "country_code": "ALG", "fifa_ranking": 34, "elo_rating": 1580, "group": "K"},
        {"name": "Hungary", "name_cn": "匈牙利", "country_code": "HUN", "fifa_ranking": 29, "elo_rating": 1620, "group": "K"},
        {"name": "Portugal", "name_cn": "葡萄牙", "country_code": "POR", "fifa_ranking": 7, "elo_rating": 1860, "group": "L"},
        {"name": "Nigeria", "name_cn": "尼日利亚", "country_code": "NGA", "fifa_ranking": 40, "elo_rating": 1570, "group": "L"},
        {"name": "Italy", "name_cn": "意大利", "country_code": "ITA", "fifa_ranking": 9, "elo_rating": 1800, "group": "L"},
        {"name": "Denmark", "name_cn": "丹麦", "country_code": "DEN", "fifa_ranking": 19, "elo_rating": 1670, "group": "L"},
    ]


def seed_players(teams):
    squad = {
        "Mexico": [
            ("Guillermo Ochoa", "奥乔亚", "GK", 1, 39, "墨西哥"),
            ("Edson Álvarez", "阿尔瓦雷斯", "DEF", 4, 27, "墨西哥"),
            ("Héctor Herrera", "埃雷拉", "MID", 16, 34, "墨西哥"),
            ("Raúl Jiménez", "希门尼斯", "FWD", 9, 33, "墨西哥"),
            ("Hirving Lozano", "洛萨诺", "FWD", 22, 29, "墨西哥"),
        ],
        "Brazil": [
            ("Alisson", "阿利松", "GK", 1, 32, "巴西"),
            ("Marquinhos", "马尔基尼奥斯", "DEF", 4, 30, "巴西"),
            ("Casemiro", "卡塞米罗", "MID", 5, 32, "巴西"),
            ("Neymar Jr", "内马尔", "FWD", 10, 32, "巴西"),
            ("Vinícius Jr", "维尼修斯", "FWD", 7, 24, "巴西"),
        ],
        "France": [
            ("Hugo Lloris", "洛里", "GK", 1, 37, "法国"),
            ("Kylian Mbappé", "姆巴佩", "FWD", 10, 27, "法国"),
            ("Antoine Griezmann", "格列兹曼", "FWD", 7, 33, "法国"),
            ("N'Golo Kanté", "坎特", "MID", 13, 33, "法国"),
            ("Dayot Upamecano", "于帕梅卡诺", "DEF", 4, 26, "法国"),
        ],
        "Argentina": [
            ("Lionel Messi", "梅西", "FWD", 10, 39, "阿根廷"),
            ("Emiliano Martínez", "马丁内斯", "GK", 23, 32, "阿根廷"),
            ("Ángel Di María", "迪马利亚", "FWD", 11, 36, "阿根廷"),
            ("Rodrigo De Paul", "德保罗", "MID", 7, 30, "阿根廷"),
            ("Cristian Romero", "罗梅罗", "DEF", 13, 28, "阿根廷"),
        ],
        "England": [
            ("Harry Kane", "凯恩", "FWD", 9, 31, "英格兰"),
            ("Jude Bellingham", "贝林厄姆", "MID", 10, 21, "英格兰"),
            ("Declan Rice", "赖斯", "MID", 4, 25, "英格兰"),
            ("John Stones", "斯通斯", "DEF", 5, 30, "英格兰"),
            ("Jordan Pickford", "皮克福德", "GK", 1, 30, "英格兰"),
        ],
        "Portugal": [
            ("Cristiano Ronaldo", "C罗", "FWD", 7, 41, "葡萄牙"),
            ("Bruno Fernandes", "B费", "MID", 8, 30, "葡萄牙"),
            ("Rúben Dias", "迪亚斯", "DEF", 4, 28, "葡萄牙"),
            ("Bernardo Silva", "B席", "MID", 20, 30, "葡萄牙"),
            ("Diogo Costa", "科斯塔", "GK", 22, 25, "葡萄牙"),
        ],
        "Spain": [
            ("Rodri", "罗德里", "MID", 16, 28, "西班牙"),
            ("Pedri", "佩德里", "MID", 8, 22, "西班牙"),
            ("Álvaro Morata", "莫拉塔", "FWD", 7, 32, "西班牙"),
            ("Aymeric Laporte", "拉波尔特", "DEF", 14, 30, "西班牙"),
            ("Unai Simón", "西蒙", "GK", 23, 27, "西班牙"),
        ],
        "Germany": [
            ("Manuel Neuer", "诺伊尔", "GK", 1, 38, "德国"),
            ("Joshua Kimmich", "基米希", "MID", 6, 29, "德国"),
            ("Jamal Musiala", "穆西亚拉", "MID", 14, 21, "德国"),
            ("Antonio Rüdiger", "吕迪格", "DEF", 2, 31, "德国"),
            ("İlkay Gündoğan", "京多安", "MID", 8, 34, "德国"),
        ],
    }

    players = []
    for team_name, player_list in squad.items():
        if team_name in teams:
            for name, name_cn, pos, num, age, nat in player_list:
                players.append(models.Player(
                    team_id=teams[team_name],
                    name=name, name_cn=name_cn,
                    position=pos, jersey_number=num,
                    age=age, nationality=nat,
                ))
    return players


def seed_matches(teams):
    group_stage = [
        ("Mexico", "South Africa", 2026, 6, 11, 18, 0, "A", "第1轮", "墨西哥城"),
        ("South Korea", "Czech Republic", 2026, 6, 11, 21, 0, "A", "第1轮", "墨西哥城"),
        ("Canada", "Bosnia", 2026, 6, 12, 15, 0, "B", "第1轮", "多伦多"),
        ("Qatar", "Switzerland", 2026, 6, 12, 18, 0, "B", "第1轮", "多伦多"),
        ("Brazil", "Morocco", 2026, 6, 12, 21, 0, "C", "第1轮", "洛杉矶"),
        ("Haiti", "Scotland", 2026, 6, 13, 15, 0, "C", "第1轮", "洛杉矶"),
        ("United States", "Paraguay", 2026, 6, 13, 18, 0, "D", "第1轮", "温哥华"),
        ("Australia", "Turkey", 2026, 6, 13, 21, 0, "D", "第1轮", "温哥华"),
        ("Germany", "Curacao", 2026, 6, 14, 15, 0, "E", "第1轮", "休斯顿"),
        ("Ivory Coast", "Ecuador", 2026, 6, 14, 18, 0, "E", "第1轮", "休斯顿"),
        ("Netherlands", "Japan", 2026, 6, 14, 21, 0, "F", "第1轮", "蒙特雷"),
        ("Sweden", "Tunisia", 2026, 6, 15, 15, 0, "F", "第1轮", "蒙特雷"),
        ("Belgium", "Egypt", 2026, 6, 15, 18, 0, "G", "第1轮", "瓜达拉哈拉"),
        ("Iran", "New Zealand", 2026, 6, 15, 21, 0, "G", "第1轮", "瓜达拉哈拉"),
        ("Spain", "Cape Verde", 2026, 6, 16, 15, 0, "H", "第1轮", "墨西哥城"),
        ("Saudi Arabia", "Uruguay", 2026, 6, 16, 18, 0, "H", "第1轮", "墨西哥城"),
        ("France", "Senegal", 2026, 6, 16, 21, 0, "I", "第1轮", "多伦多"),
        ("Iraq", "Panama", 2026, 6, 17, 15, 0, "I", "第1轮", "多伦多"),
        ("Argentina", "Chile", 2026, 6, 17, 18, 0, "J", "第1轮", "洛杉矶"),
        ("Vietnam", "Slovakia", 2026, 6, 17, 21, 0, "J", "第1轮", "洛杉矶"),
        ("England", "Colombia", 2026, 6, 18, 18, 0, "K", "第1轮", "温哥华"),
        ("Algeria", "Hungary", 2026, 6, 18, 21, 0, "K", "第1轮", "温哥华"),
        ("Portugal", "Nigeria", 2026, 6, 19, 18, 0, "L", "第1轮", "蒙特雷"),
        ("Italy", "Denmark", 2026, 6, 19, 21, 0, "L", "第1轮", "蒙特雷"),

        ("Mexico", "South Korea", 2026, 6, 18, 15, 0, "A", "第2轮", "墨西哥城"),
        ("South Africa", "Czech Republic", 2026, 6, 19, 15, 0, "A", "第2轮", "墨西哥城"),
        ("Canada", "Qatar", 2026, 6, 20, 15, 0, "B", "第2轮", "多伦多"),
        ("Bosnia", "Switzerland", 2026, 6, 20, 18, 0, "B", "第2轮", "多伦多"),
        ("Brazil", "Haiti", 2026, 6, 21, 15, 0, "C", "第2轮", "洛杉矶"),
        ("Morocco", "Scotland", 2026, 6, 21, 18, 0, "C", "第2轮", "洛杉矶"),
        ("United States", "Australia", 2026, 6, 22, 15, 0, "D", "第2轮", "温哥华"),
        ("Paraguay", "Turkey", 2026, 6, 22, 18, 0, "D", "第2轮", "温哥华"),
        ("Germany", "Ivory Coast", 2026, 6, 23, 15, 0, "E", "第2轮", "休斯顿"),
        ("Curacao", "Ecuador", 2026, 6, 23, 18, 0, "E", "第2轮", "休斯顿"),
        ("Netherlands", "Sweden", 2026, 6, 24, 15, 0, "F", "第2轮", "蒙特雷"),
        ("Japan", "Tunisia", 2026, 6, 24, 18, 0, "F", "第2轮", "蒙特雷"),
        ("Belgium", "Iran", 2026, 6, 25, 15, 0, "G", "第2轮", "瓜达拉哈拉"),
        ("Egypt", "New Zealand", 2026, 6, 25, 18, 0, "G", "第2轮", "瓜达拉哈拉"),
        ("Spain", "Saudi Arabia", 2026, 6, 26, 15, 0, "H", "第2轮", "墨西哥城"),
        ("Cape Verde", "Uruguay", 2026, 6, 26, 18, 0, "H", "第2轮", "墨西哥城"),
        ("France", "Iraq", 2026, 6, 27, 15, 0, "I", "第2轮", "多伦多"),
        ("Senegal", "Panama", 2026, 6, 27, 18, 0, "I", "第2轮", "多伦多"),
        ("Argentina", "Vietnam", 2026, 6, 28, 15, 0, "J", "第2轮", "洛杉矶"),
        ("Chile", "Slovakia", 2026, 6, 28, 18, 0, "J", "第2轮", "洛杉矶"),
        ("England", "Algeria", 2026, 6, 29, 18, 0, "K", "第2轮", "温哥华"),
        ("Colombia", "Hungary", 2026, 6, 29, 21, 0, "K", "第2轮", "温哥华"),
        ("Portugal", "Italy", 2026, 6, 30, 18, 0, "L", "第2轮", "蒙特雷"),
        ("Nigeria", "Denmark", 2026, 6, 30, 21, 0, "L", "第2轮", "蒙特雷"),

        ("Mexico", "Czech Republic", 2026, 6, 24, 21, 0, "A", "第3轮", "墨西哥城"),
        ("South Africa", "South Korea", 2026, 6, 25, 21, 0, "A", "第3轮", "墨西哥城"),
        ("Canada", "Switzerland", 2026, 6, 26, 21, 0, "B", "第3轮", "多伦多"),
        ("Bosnia", "Qatar", 2026, 6, 27, 21, 0, "B", "第3轮", "多伦多"),
        ("Brazil", "Scotland", 2026, 6, 28, 21, 0, "C", "第3轮", "洛杉矶"),
        ("Morocco", "Haiti", 2026, 6, 28, 21, 0, "C", "第3轮", "洛杉矶"),
        ("United States", "Turkey", 2026, 6, 29, 15, 0, "D", "第3轮", "温哥华"),
        ("Paraguay", "Australia", 2026, 6, 29, 18, 0, "D", "第3轮", "温哥华"),
        ("Germany", "Ecuador", 2026, 6, 30, 15, 0, "E", "第3轮", "休斯顿"),
        ("Curacao", "Ivory Coast", 2026, 6, 30, 18, 0, "E", "第3轮", "休斯顿"),
        ("Netherlands", "Tunisia", 2026, 7, 1, 15, 0, "F", "第3轮", "蒙特雷"),
        ("Japan", "Sweden", 2026, 7, 1, 18, 0, "F", "第3轮", "蒙特雷"),
        ("Belgium", "New Zealand", 2026, 7, 2, 15, 0, "G", "第3轮", "瓜达拉哈拉"),
        ("Egypt", "Iran", 2026, 7, 2, 18, 0, "G", "第3轮", "瓜达拉哈拉"),
        ("Spain", "Uruguay", 2026, 7, 3, 15, 0, "H", "第3轮", "墨西哥城"),
        ("Cape Verde", "Saudi Arabia", 2026, 7, 3, 18, 0, "H", "第3轮", "墨西哥城"),
        ("France", "Panama", 2026, 7, 4, 15, 0, "I", "第3轮", "多伦多"),
        ("Senegal", "Iraq", 2026, 7, 4, 18, 0, "I", "第3轮", "多伦多"),
        ("Argentina", "Slovakia", 2026, 7, 5, 15, 0, "J", "第3轮", "洛杉矶"),
        ("Chile", "Vietnam", 2026, 7, 5, 18, 0, "J", "第3轮", "洛杉矶"),
        ("England", "Hungary", 2026, 7, 6, 18, 0, "K", "第3轮", "温哥华"),
        ("Colombia", "Algeria", 2026, 7, 6, 21, 0, "K", "第3轮", "温哥华"),
        ("Portugal", "Denmark", 2026, 7, 7, 18, 0, "L", "第3轮", "蒙特雷"),
        ("Nigeria", "Italy", 2026, 7, 7, 21, 0, "L", "第3轮", "蒙特雷"),
    ]

    matches = []
    for h, a, y, m, d, hr, mi, gr, rnd, venue in group_stage:
        if h in teams and a in teams:
            matches.append(models.Match(
                home_team_id=teams[h], away_team_id=teams[a],
                match_date=datetime(y, m, d, hr, mi),
                group=gr, round=rnd, venue=venue,
            ))
    return matches


def seed_odds(teams, match_count):
    import random
    odds_list = []
    bookmakers = ["Bet365", "Pinnacle", "William Hill"]
    for match_id in range(1, match_count + 1):
        for bm in bookmakers:
            home_elo = 1500
            away_elo = 1500
            odds_list.append(models.Odds(
                match_id=match_id, bookmaker=bm,
                home_odds=round(random.uniform(1.5, 6.0), 2),
                draw_odds=round(random.uniform(2.0, 4.5), 2),
                away_odds=round(random.uniform(1.5, 6.0), 2),
            ))
    return odds_list


def seed_historical_matches(teams):
    hist = [
        ("Mexico", "South Korea", 2025, 10, 10, 20, 0, 2, 1, "友谊赛", "墨西哥城"),
        ("Brazil", "Argentina", 2025, 11, 15, 21, 0, 1, 0, "南美世预赛", "圣保罗"),
        ("France", "Germany", 2025, 9, 10, 20, 0, 2, 1, "友谊赛", "巴黎"),
        ("England", "Spain", 2025, 10, 12, 20, 0, 1, 1, "欧国联", "伦敦"),
        ("Portugal", "France", 2025, 11, 18, 21, 0, 0, 1, "欧国联", "里斯本"),
        ("Netherlands", "Germany", 2025, 10, 15, 20, 0, 2, 2, "欧国联", "阿姆斯特丹"),
        ("Belgium", "France", 2025, 9, 8, 20, 0, 1, 2, "友谊赛", "布鲁塞尔"),
        ("Argentina", "Brazil", 2025, 10, 16, 21, 0, 0, 1, "南美世预赛", "布宜诺斯艾利斯"),
        ("Spain", "Italy", 2025, 9, 12, 21, 0, 2, 0, "欧国联", "马德里"),
        ("Germany", "Spain", 2025, 11, 12, 20, 0, 1, 2, "友谊赛", "柏林"),
        ("Brazil", "Uruguay", 2025, 9, 10, 20, 0, 3, 0, "南美世预赛", "巴西利亚"),
        ("Argentina", "Chile", 2025, 11, 16, 21, 0, 2, 0, "南美世预赛", "布宜诺斯艾利斯"),
        ("England", "Belgium", 2025, 10, 10, 20, 0, 2, 1, "友谊赛", "伦敦"),
        ("France", "Netherlands", 2025, 10, 13, 20, 0, 4, 0, "欧国联", "巴黎"),
        ("Portugal", "Spain", 2025, 10, 8, 20, 0, 3, 2, "友谊赛", "里斯本"),
        ("Italy", "England", 2025, 11, 15, 21, 0, 0, 2, "欧国联", "米兰"),
        ("Japan", "South Korea", 2025, 10, 15, 19, 0, 1, 1, "友谊赛", "东京"),
        ("South Korea", "Japan", 2025, 9, 5, 20, 0, 2, 0, "友谊赛", "首尔"),
        ("Denmark", "Netherlands", 2025, 10, 12, 20, 0, 0, 2, "友谊赛", "哥本哈根"),
        ("Switzerland", "Belgium", 2025, 11, 18, 21, 0, 1, 1, "欧国联", "伯尔尼"),
        ("Nigeria", "Senegal", 2025, 10, 10, 18, 0, 2, 1, "非洲杯预选赛", "阿布贾"),
        ("Serbia", "Portugal", 2025, 9, 12, 21, 0, 0, 3, "欧国联", "贝尔格莱德"),
        ("Morocco", "Egypt", 2025, 10, 15, 20, 0, 2, 0, "友谊赛", "卡萨布兰卡"),
        ("Scotland", "England", 2025, 9, 12, 21, 0, 0, 2, "友谊赛", "格拉斯哥"),
        ("Iran", "Japan", 2025, 10, 8, 18, 0, 1, 1, "友谊赛", "德黑兰"),
        ("Germany", "Netherlands", 2025, 9, 8, 21, 0, 2, 1, "友谊赛", "柏林"),
        ("Spain", "Portugal", 2025, 11, 15, 21, 0, 1, 0, "友谊赛", "塞维利亚"),
        ("Italy", "Germany", 2025, 10, 18, 21, 0, 2, 1, "欧国联", "米兰"),
        ("Colombia", "Argentina", 2025, 9, 15, 20, 0, 0, 1, "南美世预赛", "波哥大"),
        ("Ecuador", "Brazil", 2025, 10, 12, 18, 0, 1, 2, "南美世预赛", "基多"),
        ("Austria", "Germany", 2025, 11, 15, 20, 0, 0, 2, "友谊赛", "维也纳"),
        ("Poland", "Spain", 2025, 10, 10, 21, 0, 1, 3, "友谊赛", "华沙"),
        ("Sweden", "Italy", 2025, 9, 10, 20, 0, 1, 1, "友谊赛", "斯德哥尔摩"),
        ("Ghana", "Nigeria", 2025, 11, 18, 18, 0, 1, 2, "非洲杯预选赛", "阿克拉"),
        ("Turkey", "Portugal", 2025, 10, 12, 20, 0, 1, 3, "友谊赛", "伊斯坦布尔"),
        ("Egypt", "Morocco", 2025, 9, 8, 20, 0, 2, 2, "非洲杯预选赛", "开罗"),
        ("Algeria", "Senegal", 2025, 10, 18, 20, 0, 1, 0, "友谊赛", "阿尔及尔"),
        ("Croatia", "Italy", 2025, 11, 12, 21, 0, 1, 0, "友谊赛", "萨格勒布"),
        ("Senegal", "Egypt", 2025, 11, 10, 18, 0, 2, 1, "友谊赛", "达喀尔"),
        ("Chile", "Uruguay", 2025, 10, 8, 21, 0, 0, 2, "南美世预赛", "圣地亚哥"),
        ("Peru", "Argentina", 2025, 11, 20, 21, 0, 0, 3, "南美世预赛", "利马"),
        ("Norway", "Netherlands", 2025, 10, 15, 20, 0, 1, 2, "友谊赛", "奥斯陆"),
    ]

    match_objects = []
    for h, a, y, m, d, hr, mi, hs, as_, comp, venue in hist:
        if h in teams and a in teams:
            match_objects.append(models.Match(
                home_team_id=teams[h], away_team_id=teams[a],
                match_date=datetime(y, m, d, hr, mi),
                status=MatchStatus.FINISHED, home_score=hs, away_score=as_,
                competition=comp, venue=venue, group=None, round="历史交锋",
            ))
    return match_objects


def main():
    db = SessionLocal()
    try:
        db.query(models.Bet).delete()
        db.query(models.Odds).delete()
        db.query(models.Match).delete()
        db.query(models.Player).delete()
        db.query(models.Team).delete()
        db.query(models.Bankroll).delete()
        db.query(models.User).delete()
        db.commit()

        # 创建默认用户
        default_user = models.User(
            username="admin",
            email="admin@example.com",
            hashed_password=hash_password("admin123"),
        )
        db.add(default_user)
        db.flush()
        print(f"Created default user: admin / admin123")

        teams = {}
        for t in seed_teams():
            team = models.Team(**t)
            db.add(team)
            db.flush()
            teams[t["name"]] = team.id
        db.commit()
        print(f"Seeded {len(teams)} teams")

        match_objects = seed_matches(teams)
        valid_matches = [m for m in match_objects if m.home_team_id is not None and m.away_team_id is not None]
        db.add_all(valid_matches)
        db.commit()
        print(f"Seeded {len(valid_matches)} group matches")

        odds_objects = seed_odds(teams, len(valid_matches))
        db.add_all(odds_objects)
        db.commit()
        print(f"Seeded {len(odds_objects)} odds records")

        player_objects = seed_players(teams)
        db.add_all(player_objects)
        db.commit()
        print(f"Seeded {len(player_objects)} players")

        hist_objects = seed_historical_matches(teams)
        db.add_all(hist_objects)
        db.commit()
        print(f"Seeded {len(hist_objects)} historical matches")

        # 为默认用户创建资金账户
        bankroll = models.Bankroll(
            user_id=default_user.id,
            initial_balance=10000.0,
            current_balance=10000.0,
        )
        db.add(bankroll)
        db.commit()
        print("Initialized bankroll: $10,000.00")

        print(f"\n[OK] 加美墨世界杯数据初始化完成！")
        print(f"总计: {len(teams)} 队 | {len(valid_matches) + len(hist_objects)} 场比赛 | {len(player_objects)} 名球员 | {len(odds_objects)} 条赔率")
        print(f"默认用户: admin / admin123")

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
