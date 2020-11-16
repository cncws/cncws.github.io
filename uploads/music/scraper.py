import requests
import os

source = {
    'netease': {
        'lrc': 'http://music.163.com/api/song/media'
    }
}

def get_lrc(output, **params):
    r = requests.get(source['netease']['lrc'], params=params)
    print(f'[state code] {r.status_code}')
    content = r.json()
    if 'lyric' in content:
        with open(output, 'w') as f:
            f.write(content['lyric'])
        print(f'[success] {os.getcwd()}/{output} saved')
    else:
        print('[fail]')

