// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Track {
  static #list = []
  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.author = author
    this.image = image
  }

  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  static getList() {
    return this.#list.reverse()
  }

  static getById(id) {
    return this.#list.find((track) => track.id === id)
  }
}

Track.create(
  'Звичка',
  'AVERIN & CHURSANOV',
  'https://picsum.photos/100/100',

)

Track.create(
  'Як мені бути',
  'ZLATA OGNEVICH',
  'https://picsum.photos/100/100',
)

Track.create(
  'Манила',
  'Baryk',
  'https://picsum.photos/100/100',
)

Track.create(
  'Відпусти',
  'KADNAY',
  'https://picsum.photos/100/100',
)

Track.create(
  'Mama',
  'Саша Чемеров',
  'https://picsum.photos/100/100',
)

Track.create(
  'Я розбиваюся',
  'Alexander Teslenko',
  'https://picsum.photos/100/100',
)

console.log(Track.getList())

class PlayList {
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = []
    this.image = `https://picsum.photos/100/100`
  }

  static create(name) {
    const newPlayList = new PlayList(name)
    this.#list.push(newPlayList)
    return newPlayList
  }

  static getList() {
    return this.#list.reverse()
  }

  static makeMix(playList) {
    const allTracks = Track.getList()

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
    playList.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      PlayList.#list.find(
        (playList) => playList.id === id,
      ) || null
    )
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  addTrack(track) {
    this.tracks.push(track)
    
  }

  static findListByValue(name) {
    return this.#list.filter((playList) =>
      playList.name.toLowerCase().includes(name.toLowerCase()),
    )
  }
 
}


// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки


router.get('/spotify-choose', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-choose', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-choose',
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  console.log(isMix)
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-create',
    data: {
      isMix,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  const name = req.body.name

  if (!name) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',

      data: {
        message: 'Помилка',
        info:'Введить назву плейлиста',
        link: isMix ? '/spotify-create?isMix=true': '/spotify-create'
      } 
    })
  }

  const playList = PlayList.create(name)

  if (isMix) {
    PlayList.makeMix(playList)
  }
 
  // console.log(playList)
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
    res.render('spotify-list', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'spotify-list',
      data: {
        playListId: playList.id,
        tracks: playList.tracks,
        name: playList.name,
      },
    })

})

// ================================================================
router.get('/spotify-list', function (req, res) {
  const id = Number(req.query.id)
  const playListId = Number(req.query.playListId)
  const playList = PlayList.getById(id)

    
  if (!playList) {
        return res.render('alert-purchase', {
          style: 'alert-purchase',

          data: {
            message: 'Помилка',
            info: 'Такого плейлиста не знайдено',
            link: `/`,
          },
        })
  
  }

  res.render('spotify-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-list',
    data: {
      playListId: playList.id,
      tracks: playList.tracks,
      name: playList.name,
    },
  })


  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

router.get('/spotify-track-delete', function (req, res) {
  const playListId = Number(req.query.playListId)
  const trackId = Number(req.query.trackId)

  const playList = PlayList.getById(playListId)
 
  if (!playList) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',

      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        link: `/spotify-list?id=${playListId}`,
      },
    })
  }

  playList.deleteTrackById(trackId)
  console.log(playList)
  // res.render генерує нам HTML сторінку
  
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-list',
    data: {
      playListId: playList.id,
      tracks: playList.tracks,
      name: playList.name,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

router.get('/spotify-list-add', function (req, res) {

  const playListId = Number(req.query.playListId)

  const playList = PlayList.getById(playListId)
 
  

  if (!playList) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',

      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        link: `/`,
      },
    })
  }

  res.render('spotify-list-add', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-list-add',
    data: {
      playListId: playList.id,
      tracks: Track.getList(),
      name: playList.name,
    },
  })

  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
router.get('/spotify-track-add', function (req, res) {

  const playListId = Number(req.query.playListId)

  const trackId = Number(req.query.trackId)

  const playList = PlayList.getById(playListId)

  const track = Track.getById(trackId)

 
 
  playList.addTrack(track)
  
  console.log(playList)

  if (!playList) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',

      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        link: `/`,
      },
    })
  }

  res.render('spotify-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-list',
    data: {
      playListId: playList.id,
      tracks: playList.tracks.reverse(),
      name: playList.name,
      
    },
  })

  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = PlayList.getList()

  console.log(list)
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-index',
    data: {
      
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),

      isEmply: list.length === 0,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

router.get('/spotify-search', function (req, res) {
  // res.render генерує нам HTML сторінку
  const value = ""
  const list = PlayList.findListByValue(value)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-search', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),

      value,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

router.post('/spotify-search', function (req, res) {
  // res.render генерує нам HTML сторінку
  const value = req.body.value || ""

  const list = PlayList.findListByValue(value)

  console.log(value)
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-search', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),

      value,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

// ================================================================

const user = require('./user')
const purchase = require('./purchase')


router.use('/', user)
router.use('/', purchase)
// ================================================================
// Підключаємо роутер до бек-енду
module.exports = router
