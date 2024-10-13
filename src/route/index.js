// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Product {
  static #list =[]

  static #count = 0

  constructor(img, title, description, category, price, amount = 0){
    this.id = ++Product.#count
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newProduct = new Product (...data)
    this.#list.push(newProduct)
  }

  static getList =()=>{
    return this.#list
  }

  static getById =(id)=>{
    return this.#list.find((product)=> product.id === id)
  }

  static getRandomList =(id)=>{
    const filteredList = this.#list.filter((product) => product.id !== id,)

   const shuffledList = filteredList.sort(()=> Math.random()-0.5,) 

   return shuffledList.slice(0,3)
  }

  
}

Product.add(
  'https://picsum.photos/200/300',
  'Компʼютер HP 8300 (SFF-DT), Intel Core i3-3220 3.3GHz, RAM 4ГБ, SSD 120ГБ',
  ' HP 8300 в корпусі SFF-DT/ Intel Core i3-3220 (3.10GHz, 2 ядра, 4 потоки)/ 4GB DDR3/ 120GB SSD (при заміні на 240GB SSD +300 грн)/ Відеокарта Intel HD Graphics 2000/ VGA, DP, USB 2.0, ComPort',
  [
    {id:1, text: 'Готовий до відправки'},
    {id:2, text: 'Топ продажів'},
  ],
  27000,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  'Компʼютер Intel i7 12 ПОТОКІВ 6 ЯДЕР + RX570 8GB + 16GB',
  ' Ядра і потоки: 6 ядер і 12 потоків, що дає змогу ефективно справлятися з багатозадачністю і багатопотоковим рендерингом',
  [
    
    {id:2, text: 'Топ продажів'},
  ],
  42000,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  'Потужний Ігровий ПК RGB+Монітор 24 Intel i5 10400F + GTX 1660 SUPER + Win11 ',
  " Стильний і доступний геймерський комп'ютер ZEVS PC OMEN X - відмінно підійде для участі в мережевих шутерах, MOBA іграх або Battle Royale, що знаходяться на піку популярності, з величезною кількістю гравців у сесії.",
  [
    {id:1, text: 'Готовий до відправки'},
    
  ],
  37000,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  'Ультра Потужний Ігровий ПК RGB Intel 18 ЯДЕР + RTX 4060 + SSD M.2 Win11',
  " Бездоганний комп'ютер. Комплектуючі ідеально збалансовані для кращої ігрової продуктивності цього року! Чудова NVIDIA RTX 4060 8Gb у парі з ультра потужним 18-ти ядедерним процесором Intel XEON E5-2699 V3 на 18/36 ядер рвуть на шматки будь-які фризи та лаги на понад високі налаштування графіки!",
  [
    {id:1, text: 'Готовий до відправки'},
    {id:2, text: 'Топ продажів'},
  ],
  33800,
  10,
)

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static calcBonusAmount = (totalPrice) => {
    return totalPrice * Purchase.#BONUS_FACTOR
  }

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = price * Purchase.#BONUS_FACTOR

    const currentBalance = Purchase.getBonusBalance(email)

    const updatedBalance =
      currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updatedBalance)

    console.log(email, updatedBalance)

    return amount
  }

  constructor(data, product) {
    this.id = ++Purchase.#count

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null
    this.bonus = data.bonus || 0
    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount
    this.comment = data.comment

    this.product = product
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)

    this.#list.push(newPurchase)

    return newPurchase
  }

  static getList = () => {
    return this.#list.reverse()
  }

  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id)
  }

  static updateById = (id, data) => {
    const product = this.getById(id)

    if (product) {
      this.update(product, data)

      return true
    } else {
      return false
    }
  }



  static updateById = (id, data) => {
    const purchase = this.getById(id)

    if (purchase) {
      this.update(purchase, data)
      return true
    } else {
      return false
    }
  }
  
  static update = (
    purchase,
    { firstname, lastname, phone, email },
  ) => {
    if (firstname) {
      purchase.firstname = firstname
    }
    if (lastname) {
      purchase.lastname = lastname
    }
    if (phone) {
      purchase.phone = phone
    }
    if (email) {
       purchase.email = email
     }
  }
 
}


class Promocode {
  static #list = []

  constructor (name, factor){
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromocode = new Promocode(name, factor)
    Promocode.#list.push(newPromocode)
    return newPromocode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add('SUMMER2024', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)
// ================================================================
// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки


router.get('/', function (req, res) {
  
  // res.render генерує нам HTML сторінку
  
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-index', {
   
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-index',
    data: {list: Product.getList(),
      
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)
  // res.render генерує нам HTML сторінку
  
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-product', {
    
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-product',
    data: {
      list: Product.getRandomList(),
      product: Product.getById(id),
      
    },
  })
  // ↑↑ сюди вводимо JSON дані
})


// ================================================================

router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  console.log(id, amount)


  if (amount < 1){
    return res.render('alert-purchase', {
      style: 'alert-purchase',
      data: {
        message: "Помилка",
        info: 'Некоректна кількість товару',
        link: `/purchase-product?id=${id}`
      }
    })
  }

  const product = Product.getById(id)

  if (product.amount < amount){
    return res.render('alert-purchase', {
      style: 'alert-purchase',
      data: {
        message: "Помилка",
        info: 'Такої кількості немає у наявності',
        link: `/purchase-product?id=${id}`
      }
    })
  }

  console.log(product, amount)
  // res.render генерує нам HTML сторінку
  

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)


  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-create', {
    
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-create',
    data: {
       id: product.id,
      
      cart: [
        {
          text: `${product.title}`,
          amount: `(${amount} шт)`,
          price: productPrice,
        },
        {
          text: `Доставка`,
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id)

  let{
    totalPrice,
    productPrice, 
    deliveryPrice, 
    amount, 
    firstname, 
    lastname, 
    phone, 
    email, 
    promocode, 
    bonus, 
    comment,
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('alert-purchase', {
    
      style: 'alert-purchase',
      data: {
      message: "Помилка",
      info: 'Товар не знайдено',
      link: `/purchase-list`
      },
    })
  }

  if (!product.amount >= amount) {
    return res.render('alert-purchase', {
    
      style: 'alert-purchase',
      data: {
      message: "Помилка",
      info: 'Товар нема у потрібній кількості',
      link: `/purchase-list`
      },
    })
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if ( isNaN(totalPrice) || isNaN(productPrice) || isNaN(deliveryPrice) || isNaN(amount) || isNaN(bonus)){
    return res.render('alert-purchase', {
    
      style: 'alert-purchase',
      data: {
      message: "Помилка",
      info: 'Некоректні дані',
      link: `/purchase-list`
      },
    })
  }

  if (!firstname || !lastname || !email || !phone){
    return res.render('alert-purchase', {
    
      style: 'alert-purchase',
      data: {
      message: "Заповніть обов'язкові поля",
      info: 'Некоректні дані',
      link: `/purchase-list`
      },
    })
  }

  if (bonus || bonus > 0){
    const bonusAmount = Purchase.getBonusBalance(email)

    console.log(bonusAmount)

    if(bonus > bonusAmount){
      bonus = bonusAmount
    }
    
    Purchase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
    
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)

    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if (totalPrice < 0) totalPrice = 0

  const purchase = Purchase.add({
    totalPrice, productPrice, deliveryPrice, amount, firstname, lastname, email, phone, promocode, comment, bonus
  }, product)

  // console.log(purchase)

  // res.render генерує нам HTML сторінку
  
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert-purchase', {
    
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert-purchase',
    data: {
      message: "Успішно",
      info: 'Замовлення створено',
      link: `/purchase-list`
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/purchase-list', function (req, res) {
  // res.render генерує нам HTML сторінку

  
  const list = Purchase.getList()
 

  // console.log(list)
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-list',
    data: {
      
      list,  
    },
  })
  // ↑↑ сюди вводимо JSON дані
})


// ================================================================


router.get('/purchase-info', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id)
  
  const purchase = Purchase.getById(id)
  const bonus = Purchase.calcBonusAmount(purchase.totalPrice)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-info', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-info',
    data: {
      id: purchase.id,
      firstname: purchase.firstname,
      lastname: purchase.lastname,
      phone: purchase.phone,
      email: purchase.email,
      product: purchase.product.title,
      comment: purchase.comment,
      productPrice: purchase.productPrice,
      deliveryPrice: purchase.deliveryPrice,
      totalPrice: purchase.totalPrice,
      bonus: bonus,
        
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.get('/purchase-update', function (req, res) {
  const id = Number(req.query.id)

  const purchase = Purchase.getById(id)

  res.render('purchase-update', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-update',
    data: {
      id: purchase.id,
      firstname: purchase.firstname,
      lastname: purchase.lastname,
      phone: purchase.phone,
      email: purchase.email,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/purchase-update', function (req, res) {
  const id = Number(req.query.id)
  const { firstname, lastname, phone, email } = req.body
  console.log(id)

  const purchase = Purchase.getById(Number(id))
  let result = false

  if (purchase) {
    Purchase.update(purchase, {
      firstname,
      lastname,
      phone,
      email
    })
    result = true
  }

  
  console.log(purchase)
  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert-purchase', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert-purchase',

    data: {
      message: `Операція успішна`,
      info: `Замовлення успішно було змінено`,
      // info: result ? 'Замовлення оновлено' : 'Помилка',
      link: `/purchase-list`,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
// ================================================================
const user = require('./user')
router.use('/', user)
// ================================================================
// Підключаємо роутер до бек-енду
module.exports = router
