# -*- coding: utf-8 -*-
{
    'name': 'Сувит. Валюта',
    'version': '0.0.1',
    'category': 'Suvit',
    'complexity': 'easy',
    'description': """
TODO
    """,
    'author': 'Suvit LLC',
    'depends': [
        'currency_rate_update',  # from barachka with RusCB support
    ],
    'init': [
    ],
    'data': [
        'views/currency.xml',

        'views/fix_account_menu.xml',

        'migrations/data/0001_currency_rate_update.xml',
    ],
    'demo': [
    ],
    'qweb': [
    ],
    'installable': True,
    'auto_install': False,
    'application': True,
    'external_dependencies' : {
        'python' : ['xmltodict'],
    }
}
