// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class User {
  static #list = []
  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }
  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )
    if (index !== 1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)

      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/user-index', function (req, res) {
  const list = User.getList()
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'user-index',
    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)
  User.add(user)
  console.log(User.getList())
  res.render('user-success-info', {
    style: 'user-success-info',
    info: 'Користувача створено',
  })
})

// ================================================================

router.get('/user-delete', function (req, res) {
  const { id } = req.query
  console.log(typeof id)

  User.deleteById(Number(id))

  res.render('user-success-info', {
    style: 'user-success-info',
    info: 'Користувача видалено',
  })
})

// ================================================================

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false

  const user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  console.log(email, password, id)
  res.render('user-success-info', {
    style: 'user-success-info',
    info: result ? 'Пошту оновлено' : 'Помилка',
  })
})

// ================================================================
// ================================================================
// ================================================================

class Product {
  static #list = []
  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = Math.floor(Math.random() * 10000000)

    this.createDate = new Date()
  }
  static add = (product) => {
    this.#list.push(product)
  }
  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static updateById = (id, data) => {
    const product = this.getById(id)

    if (product) {
      this.update(product, data)

      return true
    } else {
      return false
    }
  }

  static update = (
    product,
    { name, price, description },
  ) => {
    if (name) {
      product.name = name
    }
    if (price) {
      product.price = price
    }
    if (description) {
      product.description = description
    }
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}
// ================================================================
// ================================================================

router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)
  Product.add(product)
  console.log(Product.getList())

  res.render('alert', {
    style: 'alert',
    info: 'Товар створено',
  })
})
// ================================================================
router.get('/product-list', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-list',
    data: {
      products: {
        list,
        isEmply: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
router.get('/product-edit', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { id } = req.query

  const product = Product.getById(Number(id))
  console.log(product)
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-edit', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-edit',
    data: {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

router.post('/product-edit', function (req, res) {
  const { name, price, description, id } = req.body
  let result = false
  const product = Product.getById(Number(id))

  if (product) {
    Product.update(product, {
      name,
      price,
      description,
    })
    result = true
  }
  console.log(name, price, description, id)

  res.render('alert', {
    style: 'alert',
    info: result ? 'Товар оновлено' : 'Помилка',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/product-delete', function (req, res) {
  const { id } = req.query
  const product = Product.getById(Number(id))
  console.log(Number(id))

  let result = false
  if (product) {
    Product.deleteById(Number(id))
    result = true
  }

  res.render('alert', {
    style: 'alert',
    info: result ? 'Товар видалено' : 'Виникла помилка',
  })
})
// ================================================================
// Підключаємо роутер до бек-енду
module.exports = router
