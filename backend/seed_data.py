"""Seed initial data for the 2026 World Cup (加美墨世界杯)"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base, SessionLocal
from app import models
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
        {"name": "Iraq", "name_cn": "伊拉克", "country_code": "IRQ", "fifa_ranking": 67, "elo_rating": 1470, "group": "I"},
        {"name": "Norway", "name_cn": "挪威", "country_code": "NOR", "fifa_ranking": 36, "elo_rating": 1600, "group": "I"},

        {"name": "Argentina", "name_cn": "阿根廷", "country_code": "ARG", "fifa_ranking": 1, "elo_rating": 2050, "group": "J"},
        {"name": "Algeria", "name_cn": "阿尔及利亚", "country_code": "ALG", "fifa_ranking": 34, "elo_rating": 1550, "group": "J"},
        {"name": "Austria", "name_cn": "奥地利", "country_code": "AUT", "fifa_ranking": 23, "elo_rating": 1640, "group": "J"},
        {"name": "Jordan", "name_cn": "约旦", "country_code": "JOR", "fifa_ranking": 71, "elo_rating": 1450, "group": "J"},

        {"name": "Portugal", "name_cn": "葡萄牙", "country_code": "POR", "fifa_ranking": 7, "elo_rating": 1850, "group": "K"},
        {"name": "DR Congo", "name_cn": "刚果民主共和国", "country_code": "COD", "fifa_ranking": 63, "elo_rating": 1480, "group": "K"},
        {"name": "Uzbekistan", "name_cn": "乌兹别克斯坦", "country_code": "UZB", "fifa_ranking": 73, "elo_rating": 1460, "group": "K"},
        {"name": "Colombia", "name_cn": "哥伦比亚", "country_code": "COL", "fifa_ranking": 17, "elo_rating": 1700, "group": "K"},

        {"name": "England", "name_cn": "英格兰", "country_code": "ENG", "fifa_ranking": 4, "elo_rating": 1950, "group": "L"},
        {"name": "Croatia", "name_cn": "克罗地亚", "country_code": "CRO", "fifa_ranking": 10, "elo_rating": 1780, "group": "L"},
        {"name": "Ghana", "name_cn": "加纳", "country_code": "GHA", "fifa_ranking": 60, "elo_rating": 1520, "group": "L"},
        {"name": "Panama", "name_cn": "巴拿马", "country_code": "PAN", "fifa_ranking": 55, "elo_rating": 1500, "group": "L"},
    ]


def seed_matches(team_ids: dict):
    M = [
        # === Group A ===
        ("Mexico", "South Africa", 6, 12, 3, 0, "墨西哥城"),
        ("South Korea", "Czech Republic", 6, 12, 10, 0, "瓜达拉哈拉"),
        ("Czech Republic", "South Africa", 6, 19, 0, 0, "亚特兰大"),
        ("Mexico", "South Korea", 6, 19, 9, 0, "瓜达拉哈拉"),
        ("Czech Republic", "Mexico", 6, 25, 9, 0, "墨西哥城"),
        ("South Africa", "South Korea", 6, 25, 9, 0, "蒙特雷"),

        # === Group B ===
        ("Canada", "Bosnia", 6, 13, 3, 0, "多伦多"),
        ("Qatar", "Switzerland", 6, 14, 3, 0, "旧金山"),
        ("Switzerland", "Bosnia", 6, 19, 3, 0, "洛杉矶"),
        ("Canada", "Qatar", 6, 19, 6, 0, "温哥华"),
        ("Switzerland", "Canada", 6, 25, 3, 0, "温哥华"),
        ("Bosnia", "Qatar", 6, 25, 3, 0, "西雅图"),

        # === Group C ===
        ("Brazil", "Morocco", 6, 14, 6, 0, "纽约"),
        ("Haiti", "Scotland", 6, 14, 9, 0, "波士顿"),
        ("Scotland", "Morocco", 6, 20, 6, 0, "波士顿"),
        ("Brazil", "Haiti", 6, 20, 9, 0, "费城"),
        ("Scotland", "Brazil", 6, 25, 6, 0, "迈阿密"),
        ("Morocco", "Haiti", 6, 25, 6, 0, "亚特兰大"),

        # === Group D ===
        ("United States", "Paraguay", 6, 13, 9, 0, "洛杉矶"),
        ("Australia", "Turkey", 6, 14, 12, 0, "温哥华"),
        ("United States", "Australia", 6, 20, 3, 0, "西雅图"),
        ("Turkey", "Paraguay", 6, 20, 12, 0, "旧金山"),
        ("Turkey", "United States", 6, 26, 10, 0, "洛杉矶"),
        ("Paraguay", "Australia", 6, 26, 10, 0, "旧金山"),

        # === Group E ===
        ("Germany", "Curacao", 6, 15, 1, 0, "休斯敦"),
        ("Ivory Coast", "Ecuador", 6, 15, 7, 0, "费城"),
        ("Germany", "Ivory Coast", 6, 21, 4, 0, "多伦多"),
        ("Ecuador", "Curacao", 6, 21, 8, 0, "堪萨斯城"),
        ("Ecuador", "Germany", 6, 26, 4, 0, "纽约"),
        ("Curacao", "Ivory Coast", 6, 26, 4, 0, "费城"),

        # === Group F ===
        ("Netherlands", "Japan", 6, 15, 4, 0, "达拉斯"),
        ("Sweden", "Tunisia", 6, 15, 10, 0, "蒙特雷"),
        ("Netherlands", "Sweden", 6, 21, 1, 0, "休斯敦"),
        ("Tunisia", "Japan", 6, 21, 12, 0, "蒙特雷"),
        ("Japan", "Sweden", 6, 26, 7, 0, "达拉斯"),
        ("Tunisia", "Netherlands", 6, 26, 7, 0, "堪萨斯城"),

        # === Group G ===
        ("Belgium", "Egypt", 6, 16, 5, 0, "西雅图"),
        ("Iran", "New Zealand", 6, 16, 11, 0, "洛杉矶"),
        ("Belgium", "Iran", 6, 22, 5, 0, "洛杉矶"),
        ("New Zealand", "Egypt", 6, 22, 11, 0, "温哥华"),
        ("New Zealand", "Belgium", 6, 27, 7, 0, "温哥华"),
        ("Egypt", "Iran", 6, 27, 7, 0, "西雅图"),

        # === Group H ===
        ("Spain", "Cape Verde", 6, 16, 2, 0, "亚特兰大"),
        ("Saudi Arabia", "Uruguay", 6, 16, 8, 0, "迈阿密"),
        ("Spain", "Saudi Arabia", 6, 22, 2, 0, "亚特兰大"),
        ("Uruguay", "Cape Verde", 6, 22, 8, 0, "迈阿密"),
        ("Uruguay", "Spain", 6, 27, 4, 0, "休斯敦"),
        ("Cape Verde", "Saudi Arabia", 6, 27, 4, 0, "瓜达拉哈拉"),

        # === Group I ===
        ("France", "Senegal", 6, 17, 3, 0, "纽约"),
        ("Iraq", "Norway", 6, 17, 6, 0, "波士顿"),
        ("France", "Iraq", 6, 23, 5, 0, "费城"),
        ("Norway", "Senegal", 6, 23, 8, 0, "纽约"),
        ("Norway", "France", 6, 27, 3, 0, "波士顿"),
        ("Senegal", "Iraq", 6, 27, 3, 0, "多伦多"),

        # === Group J ===
        ("Argentina", "Algeria", 6, 17, 9, 0, "堪萨斯城"),
        ("Austria", "Jordan", 6, 17, 12, 0, "旧金山"),
        ("Argentina", "Austria", 6, 23, 3, 0, "达拉斯"),
        ("Jordan", "Algeria", 6, 23, 11, 0, "旧金山"),
        ("Jordan", "Argentina", 6, 28, 4, 0, "达拉斯"),
        ("Algeria", "Austria", 6, 28, 4, 0, "堪萨斯城"),

        # === Group K ===
        ("Portugal", "DR Congo", 6, 18, 1, 0, "休斯敦"),
        ("Uzbekistan", "Colombia", 6, 18, 10, 0, "墨西哥城"),
        ("Portugal", "Uzbekistan", 6, 24, 1, 0, "休斯敦"),
        ("Colombia", "DR Congo", 6, 24, 10, 0, "墨西哥城"),
        ("Colombia", "Portugal", 6, 28, 2, 0, "迈阿密"),
        ("DR Congo", "Uzbekistan", 6, 28, 2, 0, "蒙特雷"),

        # === Group L ===
        ("England", "Croatia", 6, 18, 4, 0, "达拉斯"),
        ("Ghana", "Panama", 6, 18, 7, 0, "休斯敦"),
        ("England", "Ghana", 6, 23, 13, 0, "堪萨斯城"),
        ("Croatia", "Panama", 6, 24, 3, 0, "西雅图"),
        ("Croatia", "England", 6, 28, 6, 0, "洛杉矶"),
        ("Panama", "Ghana", 6, 28, 6, 0, "费城"),
    ]

    round_map = {
        0: "小组赛第1轮", 1: "小组赛第1轮", 2: "小组赛第2轮", 3: "小组赛第2轮", 4: "小组赛第3轮", 5: "小组赛第3轮",
    }

    match_objects = []
    for idx, (home, away, month, day, hour, minute, venue) in enumerate(M):
        try:
            match_objects.append(models.Match(
                home_team_id=team_ids[home],
                away_team_id=team_ids[away],
                match_date=datetime(2026, month, day, hour, minute),
                group=chr(65 + idx // 6),
                round=round_map[idx % 6],
                venue=venue,
            ))
        except KeyError:
            continue
    return match_objects


def seed_odds(team_ids: dict, total_matches: int):
    odds_data = [
        ("Mexico", "South Africa", 1.50, 4.00, 6.50),
        ("South Korea", "Czech Republic", 2.30, 3.10, 3.20),
        ("Czech Republic", "South Africa", 1.65, 3.70, 5.00),
        ("Mexico", "South Korea", 2.10, 3.20, 3.50),
        ("Czech Republic", "Mexico", 4.00, 3.40, 1.85),
        ("South Africa", "South Korea", 4.50, 3.50, 1.75),

        ("Canada", "Bosnia", 2.30, 3.20, 3.10),
        ("Qatar", "Switzerland", 4.50, 3.60, 1.70),
        ("Switzerland", "Bosnia", 1.65, 3.70, 5.00),
        ("Canada", "Qatar", 2.10, 3.30, 3.40),
        ("Switzerland", "Canada", 1.80, 3.50, 4.20),
        ("Bosnia", "Qatar", 2.50, 3.10, 2.80),

        ("Brazil", "Morocco", 1.35, 4.50, 8.00),
        ("Haiti", "Scotland", 7.00, 4.20, 1.40),
        ("Scotland", "Morocco", 3.20, 3.20, 2.30),
        ("Brazil", "Haiti", 1.08, 9.00, 22.00),
        ("Scotland", "Brazil", 8.00, 4.50, 1.35),
        ("Morocco", "Haiti", 1.25, 5.00, 12.00),

        ("United States", "Paraguay", 1.70, 3.60, 4.80),
        ("Australia", "Turkey", 3.30, 3.20, 2.20),
        ("United States", "Australia", 1.55, 3.90, 5.80),
        ("Turkey", "Paraguay", 2.10, 3.30, 3.40),
        ("Turkey", "United States", 3.50, 3.40, 2.00),
        ("Paraguay", "Australia", 2.60, 3.10, 2.70),

        ("Germany", "Curacao", 1.12, 7.50, 18.00),
        ("Ivory Coast", "Ecuador", 2.70, 3.10, 2.60),
        ("Germany", "Ivory Coast", 1.45, 4.20, 6.50),
        ("Ecuador", "Curacao", 1.45, 4.00, 7.50),
        ("Ecuador", "Germany", 4.50, 3.60, 1.75),
        ("Curacao", "Ivory Coast", 5.50, 3.80, 1.60),

        ("Netherlands", "Japan", 1.55, 3.80, 6.00),
        ("Sweden", "Tunisia", 1.80, 3.40, 4.50),
        ("Netherlands", "Sweden", 1.60, 3.70, 5.50),
        ("Tunisia", "Japan", 3.60, 3.20, 2.10),
        ("Japan", "Sweden", 2.50, 3.20, 2.80),
        ("Tunisia", "Netherlands", 5.50, 3.90, 1.60),

        ("Belgium", "Egypt", 1.50, 4.00, 6.50),
        ("Iran", "New Zealand", 1.65, 3.60, 5.20),
        ("Belgium", "Iran", 1.55, 3.80, 6.00),
        ("New Zealand", "Egypt", 4.20, 3.50, 1.85),
        ("New Zealand", "Belgium", 8.50, 4.50, 1.30),
        ("Egypt", "Iran", 2.70, 3.10, 2.60),

        ("Spain", "Cape Verde", 1.20, 6.00, 13.00),
        ("Saudi Arabia", "Uruguay", 5.00, 3.50, 1.65),
        ("Spain", "Saudi Arabia", 1.18, 6.50, 14.00),
        ("Uruguay", "Cape Verde", 1.35, 4.50, 8.00),
        ("Uruguay", "Spain", 4.00, 3.40, 1.90),
        ("Cape Verde", "Saudi Arabia", 3.20, 3.20, 2.30),

        ("France", "Senegal", 1.40, 4.20, 7.00),
        ("Iraq", "Norway", 5.50, 3.80, 1.60),
        ("France", "Iraq", 1.12, 7.50, 18.00),
        ("Norway", "Senegal", 2.50, 3.10, 2.80),
        ("Norway", "France", 5.50, 3.90, 1.60),
        ("Senegal", "Iraq", 1.65, 3.60, 5.20),

        ("Argentina", "Algeria", 1.20, 6.00, 13.00),
        ("Austria", "Jordan", 1.55, 3.80, 6.00),
        ("Argentina", "Austria", 1.35, 4.50, 8.00),
        ("Jordan", "Algeria", 3.10, 3.20, 2.30),
        ("Jordan", "Argentina", 12.00, 6.00, 1.20),
        ("Algeria", "Austria", 2.80, 3.10, 2.50),

        ("Portugal", "DR Congo", 1.25, 5.00, 11.00),
        ("Uzbekistan", "Colombia", 4.50, 3.50, 1.70),
        ("Portugal", "Uzbekistan", 1.18, 6.00, 15.00),
        ("Colombia", "DR Congo", 1.55, 3.80, 6.00),
        ("Colombia", "Portugal", 4.00, 3.40, 1.85),
        ("DR Congo", "Uzbekistan", 2.30, 3.10, 3.20),

        ("England", "Croatia", 1.75, 3.50, 4.50),
        ("Ghana", "Panama", 2.40, 3.20, 2.90),
        ("England", "Ghana", 1.30, 4.80, 10.00),
        ("Croatia", "Panama", 1.50, 4.00, 6.50),
        ("Croatia", "England", 4.00, 3.40, 1.90),
        ("Panama", "Ghana", 3.20, 3.20, 2.30),
    ]

    bookmakers = ["Bet365", "William Hill", "Pinnacle"]
    odds_objects = []
    for idx, (_, _, h, d, a) in enumerate(odds_data):
        match_id = idx + 1
        for bookmaker in bookmakers:
            factor = 1 + (hash(bookmaker) % 10 - 5) * 0.02
            odds_objects.append(models.Odds(
                match_id=match_id,
                bookmaker=bookmaker,
                home_odds=round(h * factor, 2),
                draw_odds=round(d * factor, 2),
                away_odds=round(a * factor, 2),
            ))
    return odds_objects


PLAYER_TEMPLATES = {
    "Argentina": [
        ("L. Messi", "梅西", "FWD", 10, 37), ("J. Alvarez", "阿尔瓦雷斯", "FWD", 9, 26),
        ("L. Martinez", "劳塔罗", "FWD", 22, 27), ("E. Fernandez", "恩佐", "MID", 24, 24),
        ("R. De Paul", "德保罗", "MID", 7, 30), ("A. Mac Allister", "麦卡利斯特", "MID", 20, 26),
        ("L. Paredes", "帕雷德斯", "MID", 5, 30), ("N. Molina", "莫利纳", "DEF", 26, 26),
        ("C. Romero", "罗梅罗", "DEF", 13, 26), ("N. Otamendi", "奥塔门迪", "DEF", 19, 36),
        ("E. Martinez", "马丁内斯", "GK", 23, 31),
    ],
    "Brazil": [
        ("Vinicius Jr", "维尼修斯", "FWD", 7, 24), ("Rodrygo", "罗德里戈", "FWD", 10, 24),
        ("Richarlison", "理查利松", "FWD", 9, 27), ("Neymar Jr", "内马尔", "FWD", 11, 33),
        ("Casemiro", "卡塞米罗", "MID", 5, 33), ("Bruno G.", "布鲁诺", "MID", 8, 26),
        ("Paqueta", "帕奎塔", "MID", 18, 27), ("E. Militao", "米利唐", "DEF", 3, 27),
        ("Marquinhos", "马尔基尼奥斯", "DEF", 4, 30), ("Danilo", "达尼洛", "DEF", 2, 33),
        ("Alisson", "阿利松", "GK", 1, 31),
    ],
    "France": [
        ("K. Mbappe", "姆巴佩", "FWD", 10, 27), ("A. Griezmann", "格列兹曼", "FWD", 7, 34),
        ("O. Giroud", "吉鲁", "FWD", 9, 38), ("A. Tchouameni", "琼阿梅尼", "MID", 8, 25),
        ("E. Camavinga", "卡马文加", "MID", 12, 23), ("Y. Fofana", "福法纳", "MID", 19, 25),
        ("T. Hernandez", "特奥", "DEF", 22, 27), ("D. Upamecano", "于帕梅卡诺", "DEF", 4, 26),
        ("I. Konate", "科纳特", "DEF", 24, 25), ("J. Kounde", "孔德", "DEF", 5, 26),
        ("H. Lloris", "洛里", "GK", 1, 38),
    ],
    "England": [
        ("H. Kane", "凯恩", "FWD", 9, 31), ("B. Saka", "萨卡", "FWD", 7, 23),
        ("P. Foden", "福登", "MID", 10, 24), ("J. Bellingham", "贝林厄姆", "MID", 11, 22),
        ("D. Rice", "赖斯", "MID", 4, 26), ("M. Mount", "芒特", "MID", 19, 26),
        ("K. Walker", "沃克", "DEF", 2, 34), ("J. Stones", "斯通斯", "DEF", 5, 30),
        ("H. Maguire", "马奎尔", "DEF", 6, 32), ("R. James", "詹姆斯", "DEF", 24, 25),
        ("J. Pickford", "皮克福德", "GK", 1, 31),
    ],
    "Portugal": [
        ("C. Ronaldo", "C罗", "FWD", 7, 40), ("B. Silva", "B席", "MID", 10, 30),
        ("Bruno F.", "B费", "MID", 8, 30), ("J. Felix", "菲利克斯", "FWD", 11, 25),
        ("R. Leao", "莱奥", "FWD", 17, 25), ("R. Dias", "迪亚斯", "DEF", 4, 27),
        ("N. Mendes", "门德斯", "DEF", 19, 22), ("J. Cancelo", "坎塞洛", "DEF", 20, 30),
        ("Pepe", "佩佩", "DEF", 3, 42), ("D. Costa", "科斯塔", "GK", 22, 25),
        ("Vitinha", "维蒂尼亚", "MID", 14, 25),
    ],
    "Netherlands": [
        ("M. Depay", "德佩", "FWD", 10, 31), ("C. Gakpo", "加克波", "FWD", 8, 25),
        ("D. Dumfries", "邓弗里斯", "DEF", 22, 28), ("V. van Dijk", "范迪克", "DEF", 4, 33),
        ("N. Ake", "阿克", "DEF", 5, 30), ("M. de Ligt", "德里赫特", "DEF", 3, 25),
        ("F. de Jong", "德容", "MID", 21, 27), ("T. Koopmeiners", "库普梅纳斯", "MID", 14, 27),
        ("J. Timber", "廷贝尔", "DEF", 2, 23), ("X. Simons", "西蒙斯", "MID", 7, 21),
        ("B. Verbruggen", "维尔布鲁根", "GK", 1, 22),
    ],
    "Spain": [
        ("Alvaro Morata", "莫拉塔", "FWD", 7, 32), ("N. Williams", "尼科", "FWD", 11, 22),
        ("L. Yamal", "亚马尔", "FWD", 19, 17), ("Pedri", "佩德里", "MID", 8, 22),
        ("Gavi", "加维", "MID", 6, 20), ("Rodri", "罗德里", "MID", 16, 28),
        ("D. Olmo", "奥尔莫", "MID", 10, 26), ("A. Laporte", "拉波尔特", "DEF", 14, 30),
        ("Pau Torres", "托雷斯", "DEF", 15, 28), ("Carvajal", "卡瓦哈尔", "DEF", 2, 33),
        ("Unai Simon", "西蒙", "GK", 23, 27),
    ],
    "Belgium": [
        ("K. De Bruyne", "德布劳内", "MID", 7, 33), ("R. Lukaku", "卢卡库", "FWD", 10, 31),
        ("J. Doku", "多库", "FWD", 11, 22), ("L. Trossard", "特罗萨德", "FWD", 9, 29),
        ("Y. Tielemans", "蒂勒曼斯", "MID", 8, 27), ("A. Onana", "奥纳纳", "MID", 18, 23),
        ("J. Vertonghen", "维尔通亨", "DEF", 5, 37), ("T. Castagne", "卡斯塔涅", "DEF", 21, 28),
        ("W. Faes", "费斯", "DEF", 3, 26), ("A. Theate", "泰特", "DEF", 4, 24),
        ("T. Courtois", "库尔图瓦", "GK", 1, 32),
    ],
    "Germany": [
        ("T. Muller", "穆勒", "FWD", 13, 35), ("K. Havertz", "哈弗茨", "FWD", 7, 25),
        ("L. Musiala", "穆夏拉", "MID", 10, 22), ("I. Gundogan", "京多安", "MID", 8, 34),
        ("J. Kimmich", "基米希", "MID", 6, 30), ("F. Wirtz", "维尔茨", "MID", 11, 21),
        ("A. Rudiger", "吕迪格", "DEF", 2, 32), ("N. Schlotterbeck", "施洛特贝克", "DEF", 4, 25),
        ("D. Raum", "劳姆", "DEF", 3, 26), ("J. Tah", "塔赫", "DEF", 5, 28),
        ("M. ter Stegen", "特尔施特根", "GK", 22, 32),
    ],
    "Croatia": [
        ("L. Modric", "莫德里奇", "MID", 10, 39), ("I. Perisic", "佩里西奇", "FWD", 14, 36),
        ("A. Kramaric", "克拉马里奇", "FWD", 9, 33), ("M. Kovacic", "科瓦西奇", "MID", 8, 30),
        ("M. Pasalic", "帕萨利奇", "MID", 13, 28), ("L. Sucic", "苏西奇", "MID", 7, 22),
        ("J. Gvardiol", "格瓦迪奥尔", "DEF", 24, 23), ("J. Stanisic", "斯塔尼西奇", "DEF", 2, 24),
        ("B. Sosa", "索萨", "DEF", 3, 26), ("J. Juranovic", "尤拉诺维奇", "DEF", 22, 29),
        ("D. Livakovic", "利瓦科维奇", "GK", 1, 30),
    ],
    "Mexico": [
        ("S. Gimenez", "吉梅内斯", "FWD", 9, 23), ("H. Lozano", "洛萨诺", "FWD", 10, 29),
        ("A. Vega", "维加", "FWD", 11, 27), ("E. Alvarez", "阿尔瓦雷斯", "MID", 4, 27),
        ("L. Romo", "罗莫", "MID", 7, 29), ("C. Rodriguez", "罗德里格斯", "MID", 8, 28),
        ("H. Moreno", "莫雷诺", "DEF", 15, 37), ("J. Araujo", "阿劳霍", "DEF", 5, 26),
        ("K. Alvarez", "K·阿尔瓦雷斯", "DEF", 3, 24), ("J. Sanchez", "桑切斯", "DEF", 19, 25),
        ("G. Ochoa", "奥乔亚", "GK", 13, 39),
    ],
    "Uruguay": [
        ("D. Nunez", "努涅斯", "FWD", 9, 25), ("F. Valverde", "巴尔韦德", "MID", 15, 26),
        ("G. De Arrascaeta", "德阿拉斯卡埃塔", "MID", 10, 30), ("R. Bentancur", "本坦库尔", "MID", 6, 27),
        ("M. Arambarri", "阿兰巴里", "MID", 5, 27), ("F. Pellistri", "佩利斯特里", "FWD", 8, 23),
        ("J. M. Gimenez", "吉梅内斯", "DEF", 2, 30), ("R. Araujo", "阿劳霍", "DEF", 3, 26),
        ("M. Olivera", "奥利韦拉", "DEF", 17, 27), ("N. Nandez", "南德斯", "DEF", 22, 29),
        ("S. Rochet", "罗切特", "GK", 1, 31),
    ],
    "United States": [
        ("C. Pulisic", "普利西奇", "FWD", 10, 26), ("F. Balogun", "巴洛贡", "FWD", 20, 23),
        ("T. Weah", "维阿", "FWD", 12, 25), ("G. Reyna", "雷纳", "MID", 7, 22),
        ("W. McKennie", "麦肯尼", "MID", 8, 26), ("T. Adams", "亚当斯", "MID", 14, 26),
        ("S. Dest", "德斯特", "DEF", 2, 24), ("A. Robinson", "罗宾逊", "DEF", 5, 27),
        ("C. Richards", "理查兹", "DEF", 3, 24), ("T. Ream", "里姆", "DEF", 13, 37),
        ("M. Turner", "特纳", "GK", 1, 30),
    ],
    "Canada": [
        ("J. David", "戴维", "FWD", 20, 25), ("A. Davies", "戴维斯", "MID", 19, 24),
        ("C. Larin", "拉林", "FWD", 17, 29), ("S. Eustaquio", "尤斯塔奎奥", "MID", 8, 28),
        ("I. Kone", "科内", "MID", 14, 22), ("J. Osorio", "奥索里奥", "MID", 21, 31),
        ("A. Johnston", "约翰斯顿", "DEF", 2, 25), ("K. Miller", "米勒", "DEF", 4, 27),
        ("S. Vitoria", "维多利亚", "DEF", 5, 38), ("R. Laryea", "拉里亚", "DEF", 22, 30),
        ("M. Crepeau", "克雷波", "GK", 18, 30),
    ],
    "Switzerland": [
        ("X. Shaqiri", "沙奇里", "FWD", 23, 33), ("B. Embolo", "恩博洛", "FWD", 7, 28),
        ("R. Freuler", "弗罗伊勒", "MID", 8, 33), ("G. Xhaka", "扎卡", "MID", 10, 32),
        ("D. Zakaria", "扎卡里亚", "MID", 6, 28), ("M. Akanji", "阿坎吉", "DEF", 5, 29),
        ("N. Elvedi", "埃尔维迪", "DEF", 4, 28), ("R. Rodriguez", "罗德里格斯", "DEF", 13, 32),
        ("K. Mbabu", "姆巴布", "DEF", 2, 29), ("Y. Sommer", "索默", "GK", 1, 36),
        ("F. Schar", "舍尔", "DEF", 22, 33),
    ],
    "Colombia": [
        ("L. Diaz", "迪亚斯", "FWD", 7, 28), ("R. Borre", "博雷", "FWD", 19, 29),
        ("J. Arias", "阿里亚斯", "MID", 10, 27), ("J. Rodriguez", "J罗", "MID", 10, 33),
        ("W. Barrios", "巴里奥斯", "MID", 6, 31), ("M. Uribe", "乌里韦", "MID", 15, 32),
        ("D. Sanchez", "桑切斯", "DEF", 23, 28), ("Y. Mina", "米纳", "DEF", 13, 30),
        ("C. Cuesta", "奎斯塔", "DEF", 3, 25), ("D. Munoz", "穆尼奥斯", "DEF", 21, 27),
        ("C. Vargas", "巴尔加斯", "GK", 12, 35),
    ],
    "Japan": [
        ("T. Kubo", "久保建英", "FWD", 7, 23), ("D. Maeda", "前田大然", "FWD", 9, 27),
        ("J. Ito", "伊东纯也", "MID", 14, 31), ("T. Minamino", "南野拓实", "MID", 10, 30),
        ("W. Endo", "远藤航", "MID", 5, 31), ("H. Morita", "守田英正", "MID", 13, 29),
        ("K. Tomiyasu", "富安健洋", "DEF", 22, 26), ("T. Kamada", "镰田大地", "MID", 15, 28),
        ("H. Ito", "伊藤洋辉", "DEF", 3, 25), ("S. Machino", "町田浩树", "DEF", 4, 27),
        ("Z. Suzuki", "铃木彩艳", "GK", 23, 22),
    ],
    "Morocco": [
        ("A. Ziyech", "齐耶赫", "FWD", 7, 32), ("Y. En-Nesyri", "恩内斯里", "FWD", 19, 27),
        ("H. Ziyech", "哈基米·齐耶赫", "FWD", 10, 28), ("S. Amrabat", "阿姆拉巴特", "MID", 4, 28),
        ("A. Ounahi", "欧纳希", "MID", 8, 24), ("B. El Khannouss", "汉努斯", "MID", 17, 20),
        ("A. Hakimi", "阿什拉夫", "DEF", 2, 26), ("R. Saiss", "赛斯", "DEF", 6, 34),
        ("N. Mazraoui", "马兹拉维", "DEF", 3, 27), ("A. Aguerd", "阿盖尔", "DEF", 5, 26),
        ("Y. Bono", "布努", "GK", 1, 33),
    ],
    "Senegal": [
        ("S. Mane", "马内", "FWD", 10, 32), ("N. Jackson", "杰克逊", "FWD", 9, 23),
        ("I. Sarr", "萨尔", "FWD", 19, 26), ("P. Gueye", "盖耶", "MID", 5, 35),
        ("P. Sarr", "帕普·萨尔", "MID", 25, 22), ("N. Mendy", "门迪", "MID", 6, 31),
        ("K. Koulibaly", "库利巴利", "DEF", 3, 33), ("A. Diallo", "迪亚洛", "DEF", 22, 27),
        ("N. Ndiaye", "恩迪亚耶", "DEF", 14, 24), ("I. Jakobs", "雅各布斯", "DEF", 2, 25),
        ("E. Mendy", "门迪", "GK", 16, 32),
    ],
    "South Korea": [
        ("Son Heung-min", "孙兴慜", "FWD", 7, 32), ("Hwang Hee-chan", "黄喜灿", "FWD", 11, 29),
        ("Lee Kang-in", "李刚仁", "MID", 10, 24), ("Kim Min-jae", "金玟哉", "DEF", 4, 28),
        ("Hwang In-beom", "黄仁范", "MID", 8, 28), ("Lee Jae-sung", "李在城", "MID", 13, 32),
        ("Jung Woo-young", "郑又荣", "MID", 5, 35), ("Kim Young-gwon", "金英权", "DEF", 19, 35),
        ("Seol Young-woo", "薛英佑", "DEF", 23, 26), ("Kim Jin-su", "金珍洙", "DEF", 3, 32),
        ("Jo Hyeon-woo", "赵贤祐", "GK", 21, 33),
    ],
    "Turkey": [
        ("C. Tosun", "托松", "FWD", 9, 33), ("K. Akturkoglu", "阿克图尔科格鲁", "FWD", 7, 26),
        ("A. Guler", "居莱尔", "MID", 10, 20), ("H. Calhanoglu", "恰尔汗奥卢", "MID", 10, 31),
        ("I. Yuksek", "于克塞克", "MID", 5, 26), ("S. Ozcan", "厄兹詹", "MID", 8, 27),
        ("M. Demiral", "德米拉尔", "DEF", 3, 27), ("A. Bardakci", "巴尔达克奇", "DEF", 4, 26),
        ("F. Kadioglu", "卡迪奥卢", "DEF", 2, 25), ("C. Soyuncu", "瑟云聚", "DEF", 6, 28),
        ("M. Gunok", "古诺克", "GK", 1, 35),
    ],
    "Sweden": [
        ("A. Isak", "伊萨克", "FWD", 9, 25), ("D. Kulusevski", "库卢塞夫斯基", "FWD", 10, 24),
        ("E. Forsberg", "福斯贝里", "MID", 10, 33), ("K. Olsson", "奥尔森", "MID", 8, 29),
        ("J. Svensson", "斯文森", "MID", 5, 32), ("V. Gyokeres", "哲凯赖什", "FWD", 11, 26),
        ("V. Lindelof", "林德洛夫", "DEF", 4, 30), ("I. Helander", "赫兰德", "DEF", 3, 31),
        ("L. Augustinsson", "奥古斯丁松", "DEF", 6, 30), ("E. Krafth", "克拉夫特", "DEF", 2, 30),
        ("R. Olsen", "奥尔森", "GK", 1, 34),
    ],
    "Norway": [
        ("E. Haaland", "哈兰德", "FWD", 9, 24), ("M. Odegaard", "厄德高", "MID", 10, 26),
        ("A. Sorloth", "索尔洛特", "FWD", 19, 29), ("S. Berge", "伯格", "MID", 8, 27),
        ("F. Aursnes", "奥尔什内斯", "MID", 5, 29), ("P. Berg", "贝尔格", "MID", 7, 27),
        ("A. Hanche-Olsen", "汉切-奥尔森", "DEF", 3, 27), ("L. Ostigard", "厄斯蒂高", "DEF", 4, 24),
        ("J. Ryerson", "瑞尔森", "DEF", 2, 27), ("B. Meling", "梅林", "DEF", 23, 31),
        ("O. Nyland", "尼兰德", "GK", 12, 34),
    ],
}

DEFAULT_SQUAD_POSITIONS = [
    ("前锋1", "FWD"), ("前锋2", "FWD"), ("中场1", "MID"),
    ("中场2", "MID"), ("中场3", "MID"), ("后卫1", "DEF"),
    ("后卫2", "DEF"), ("后卫3", "DEF"), ("后卫4", "DEF"),
    ("门将", "GK"),
]


def seed_players(team_ids: dict):
    all_players = []
    for team_name, team_id in team_ids.items():
        if team_name in PLAYER_TEMPLATES:
            for name, name_cn, position, jersey, age in PLAYER_TEMPLATES[team_name]:
                all_players.append(models.Player(
                    team_id=team_id, name=name, name_cn=name_cn,
                    position=position, jersey_number=jersey, age=age, nationality=team_name,
                ))
        else:
            for i, (pos_cn, pos) in enumerate(DEFAULT_SQUAD_POSITIONS):
                all_players.append(models.Player(
                    team_id=team_id,
                    name=f"{team_name} {pos_cn}",
                    name_cn=pos_cn,
                    position=pos, jersey_number=i + 1, age=None, nationality=team_name,
                ))
    return all_players


def seed_historical_matches(team_ids: dict):
    from app.models import MatchStatus
    hist = [
        ("Argentina", "Brazil", 2025, 11, 15, 20, 0, 3, 1, "友谊赛", "布宜诺斯艾利斯"),
        ("France", "England", 2025, 10, 12, 21, 0, 2, 1, "欧国联", "巴黎"),
        ("Brazil", "Mexico", 2025, 9, 5, 20, 0, 2, 0, "友谊赛", "圣保罗"),
        ("Spain", "Italy", 2025, 10, 15, 21, 0, 1, 1, "欧国联", "马德里"),
        ("Portugal", "Croatia", 2025, 9, 8, 20, 0, 2, 1, "欧国联", "里斯本"),
        ("Netherlands", "Germany", 2025, 11, 18, 21, 0, 2, 2, "友谊赛", "阿姆斯特丹"),
        ("England", "Italy", 2025, 11, 12, 20, 0, 3, 0, "友谊赛", "伦敦"),
        ("Argentina", "Uruguay", 2025, 10, 8, 21, 0, 1, 0, "南美世预赛", "布宜诺斯艾利斯"),
        ("Brazil", "Argentina", 2025, 8, 20, 20, 0, 1, 2, "南美世预赛", "里约热内卢"),
        ("Belgium", "France", 2025, 10, 10, 21, 0, 1, 2, "欧国联", "布鲁塞尔"),
        ("Uruguay", "Colombia", 2025, 11, 15, 20, 0, 2, 1, "南美世预赛", "蒙得维的亚"),
        ("Mexico", "United States", 2025, 11, 16, 22, 0, 1, 1, "中北美联赛", "墨西哥城"),
        ("United States", "Mexico", 2025, 8, 25, 21, 0, 2, 0, "中北美联赛", "洛杉矶"),
        ("Canada", "United States", 2025, 9, 10, 20, 0, 1, 2, "中北美联赛", "多伦多"),
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
        if h in team_ids and a in team_ids:
            match_objects.append(models.Match(
                home_team_id=team_ids[h], away_team_id=team_ids[a],
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
        db.commit()

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

        bankroll = models.Bankroll(initial_balance=10000.0, current_balance=10000.0)
        db.add(bankroll)
        db.commit()
        print("Initialized bankroll: $10,000.00")

        print(f"\n✅ 加美墨世界杯数据初始化完成！")
        print(f"总计: {len(teams)} 队, {len(valid_matches) + len(hist_objects)} 场比赛, {len(player_objects)} 名球员, {len(odds_objects)} 条赔率")

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
