export type ProductSpec = {
  label: string
  value: string
}

export type ProductVariant = {
  label: string
  price: number
}

export type CatalogProduct = {
  id: string
  name: string
  shortName: string
  kind: string
  image: string
  source: string
  sourceLabel: string
  lead: string
  description: string
  notes: string[]
  specs: ProductSpec[]
  variants?: ProductVariant[]
  price?: number
  priceLabel?: string
  accent: string
}

export const coffeeProducts: CatalogProduct[] = [
  {
    id: 'brazil-cerrado',
    name: 'Бразилия Серрадо',
    shortName: 'Серрадо',
    kind: 'Кофе для эспрессо',
    image: '/assets/coffee-brazil.jpg',
    source: 'https://ingresso.coffee/product/brazil-cerrado/',
    sourceLabel: 'Ingresso Coffee',
    lead:
      'Плотное сиропистое тело, высокая сладость и умеренная кислотность.',
    description:
      'Сбалансированный кофе почти без кислинки. Базовый лот для эспрессо, который также подходит для капучино, латте, турки и гейзерной кофеварки.',
    notes: ['Жёлтые фрукты', 'Тёмный шоколад', 'Грецкий орех'],
    specs: [
      { label: 'Регион', value: 'Серрадо, Бразилия' },
      { label: 'Вид', value: 'Арабика' },
      { label: 'Обработка', value: 'Натуральная' },
      { label: 'Высота', value: '850–1100 м' },
      { label: 'Оценка SCA', value: '82,00' },
    ],
    variants: [
      { label: '100 г', price: 324 },
      { label: '250 г', price: 686 },
      { label: '1 кг', price: 2192 },
    ],
    accent: '#a6613d',
  },
  {
    id: 'brazil-vietnam',
    name: 'Espresso Blend Brazil / Vietnam',
    shortName: 'Brazil / Vietnam',
    kind: 'Эспрессо-бленд',
    image: '/assets/coffee-brazil-vietnam.jpg',
    source: 'https://ingresso.coffee/product/espresso-blend-brazil-vietnam/',
    sourceLabel: 'Ingresso Coffee',
    lead:
      'Шоколадный и пряный бленд с лёгкой яблочной кислотностью.',
    description:
      'Стабильный насыщенный профиль для эспрессо и напитков с молоком. Подходит для автоматических кофемашин и вендинговых аппаратов.',
    notes: ['Тёмный шоколад', 'Специи', 'Яблоко'],
    specs: [
      { label: 'Происхождение', value: 'Бразилия, Вьетнам' },
      { label: 'Состав', value: 'Арабика 80% / Робуста 20%' },
      { label: 'Обработка', value: 'Натуральная' },
      { label: 'Урожай', value: '2023' },
    ],
    variants: [
      { label: '100 г', price: 315 },
      { label: '250 г', price: 666 },
      { label: '1 кг', price: 2106 },
    ],
    accent: '#80533e',
  },
  {
    id: 'karuzo',
    name: 'Espresso Blend Karuzo',
    shortName: 'Karuzo',
    kind: 'Тёмная обжарка',
    image: '/assets/coffee-karuzo.jpg',
    source: 'https://ingresso.coffee/product/espresso-blend-karuzo/',
    sourceLabel: 'Ingresso Coffee',
    lead:
      'Крепкий и насыщенный бленд с плотным телом и выраженной горчинкой.',
    description:
      'Высокое содержание робусты формирует плотную устойчивую крема. Бленд рассчитан на автоматические кофемашины, вендинг, офисы, кафе и домашнее использование.',
    notes: ['Тёмный шоколад', 'Специи', 'Тёмная карамель'],
    specs: [
      { label: 'Происхождение', value: 'Бразилия, Вьетнам' },
      { label: 'Состав', value: 'Арабика 50% / Робуста 50%' },
      { label: 'Обработка', value: 'Натуральная' },
      { label: 'Обжарка', value: 'Тёмная' },
    ],
    variants: [
      { label: '100 г', price: 316 },
      { label: '250 г', price: 660 },
      { label: '1 кг', price: 1975 },
    ],
    accent: '#3a2520',
  },
  {
    id: 'colombia-supremo',
    name: 'Колумбия Supremo Filter',
    shortName: 'Colombia Supremo',
    kind: 'Обжарка под фильтр',
    image: '/assets/coffee-colombia.jpg',
    source: 'https://ingresso.coffee/product/kolumbiya-supremo-filtr/',
    sourceLabel: 'Ingresso Coffee',
    lead:
      'Яркий и чистый кофе с сочной кислотностью и гладким телом.',
    description:
      'Выразительный фильтр-лот, который раскрывается нотами фруктов и карамели. Подходит для V60, кемекса, калиты, фильтр-кофеварки и аэропресса.',
    notes: ['Яблочный мармелад', 'Тёмная карамель', 'Грейпфрут'],
    specs: [
      { label: 'Регион', value: 'Антьокия, Колумбия' },
      { label: 'Разновидности', value: 'Катурра, Типика, Бурбон' },
      { label: 'Обработка', value: 'Мытая' },
      { label: 'Высота', value: '1450–1750 м' },
      { label: 'Скрин', value: '17/18' },
      { label: 'Оценка Q-грейдера', value: '84' },
    ],
    variants: [
      { label: '100 г', price: 418 },
      { label: '250 г', price: 832 },
      { label: '1 кг', price: 2798 },
    ],
    accent: '#6f3034',
  },
  {
    id: 'drip-assortment',
    name: 'Ассорти дрип-кофе — 30 штук',
    shortName: '30 дрипов',
    kind: 'Набор на месяц',
    image: '/assets/coffee-drips.jpg',
    source: 'https://ingresso.coffee/product/assorti-drip-paketov-30-shtuk/',
    sourceLabel: 'Ingresso Coffee',
    lead:
      'Шесть ярких сортов кофе — по пять дрип-пакетов каждого.',
    description:
      'Компактный набор для офиса, путешествий и дома. Для приготовления достаточно высокой чашки и горячей воды 90–96 °C.',
    notes: ['6 сортов', '30 порций', 'Без оборудования'],
    specs: [
      { label: 'Бразилия Серрадо', value: '5 шт.' },
      { label: 'Гондурас Ика-Хау', value: '5 шт.' },
      { label: 'Китай Юньнань', value: '5 шт.' },
      { label: 'Колумбия Хуан Чаморро', value: '5 шт.' },
      { label: 'Колумбия Сеникафе', value: '5 шт.' },
      { label: 'Эфиопия Гуджи Гигеса', value: '5 шт.' },
    ],
    variants: [
      { label: 'Коробка, 30 шт.', price: 2720 },
      { label: 'Зип-пакет, 30 шт.', price: 2720 },
    ],
    accent: '#8d6a4a',
  },
]

export const equipmentProducts: CatalogProduct[] = [
  {
    id: 'futurmat-ottima',
    name: 'Futurmat Ottima Evo',
    shortName: 'Ottima Evo',
    kind: 'Профессиональная эспрессо-машина',
    image: '/assets/equipment-futurmat.png',
    source: 'https://futurmat.evocagroup.com/en/node/2174',
    sourceLabel: 'Futurmat / Evoca Group',
    lead:
      'Надёжная барная машина с высокой термостабильностью и лаконичным дизайном.',
    description:
      'Медный бойлер, независимые термосифонные теплообменники для каждой группы, электронный контроль уровня воды и четыре программируемые дозы.',
    notes: ['HoReCa', 'Термостабильность', '4 дозы'],
    specs: [
      { label: 'Версия', value: 'Ottima Evo 1GR' },
      { label: 'Группы', value: '1' },
      { label: 'Габариты', value: '450 × 420 × 520 мм' },
      { label: 'Вес', value: '35 кг' },
      { label: 'Бойлер', value: '5 л' },
      { label: 'Питание', value: '230 В / 50–60 Гц' },
      { label: 'Мощность', value: '2700 Вт' },
    ],
    priceLabel: 'Цена по запросу',
    accent: '#736c64',
  },
  {
    id: 'eureka-disco',
    name: 'Eureka Disco',
    shortName: 'Disco',
    kind: 'Автоматический темпер',
    image: '/assets/equipment-eureka.jpg',
    source: 'https://entero.ru/item/321196',
    sourceLabel: 'ENTERO',
    lead:
      'Точная и последовательная темперовка для интенсивной работы бара.',
    description:
      'Сенсорное управление и магнитный датчик автоматически определяют портафильтр. Поддерживается одинарная или двойная темперовка с регулировкой давления.',
    notes: ['1,5 секунды', '10–30 кг', 'Италия'],
    specs: [
      { label: 'Давление', value: '10–30 кг' },
      { label: 'Время темперовки', value: '1,5 сек.' },
      { label: 'Диапазон дисков', value: '53–58,3 мм' },
      { label: 'Габариты', value: '110 × 223 × 253 мм' },
      { label: 'Вес', value: '6,6 кг' },
      { label: 'Напряжение', value: '220 В' },
    ],
    price: 43175,
    accent: '#77706a',
  },
  {
    id: 'jetinno-jl36a',
    name: 'Jetinno JL36A',
    shortName: 'JL36A',
    kind: 'Суперавтоматическая кофемашина',
    image: '/assets/equipment-jetinno.webp',
    source:
      'https://www.jetinnomachine.com/horeca/jl36-fully-automatic-coffee-machine.html',
    sourceLabel: 'Jetinno',
    lead:
      'Коммерческая машина высокой производительности для точек с большим потоком.',
    description:
      'Зеркальная передняя панель из нержавеющей стали, трёхцветная подсветка, съёмный бункер и сенсорный экран 10,1 дюйма.',
    notes: ['До 100 чашек/день', 'Свежое молоко', '10,1″'],
    specs: [
      { label: 'Производительность', value: '100 чашек/день' },
      { label: 'Габариты', value: '300 × 585 × 512 мм' },
      { label: 'Вес', value: '22 кг' },
      { label: 'Мощность', value: '3500 Вт' },
      { label: 'Бункер зерна', value: '1200 г × 1' },
      { label: 'Экран', value: '10,1″ сенсорный' },
      { label: 'Высота носика', value: '105–180 мм' },
      { label: 'Подключение', value: 'Wi‑Fi, 4G опционально' },
    ],
    priceLabel: 'Цена по запросу',
    accent: '#84613f',
  },
]

export const chemistryProducts = [
  {
    code: 'P63',
    name: 'Порошок для удаления кофейных масел',
    image: '/assets/chemistry-p63-cutout.png',
  },
  {
    code: 'Д3',
    name: 'Универсальное средство для удаления накипи',
    image: '/assets/chemistry-d3-cutout.png',
  },
  {
    code: 'M7',
    name: 'Средство для очистки молочных систем',
    image: '/assets/chemistry-m7-cutout.png',
  },
  {
    code: 'T5',
    name: 'Таблетки для удаления кофейных масел',
    image: '/assets/chemistry-t5-cutout.png',
  },
]

export const serviceItems = [
  'Диагностика',
  'Обслуживание',
  'Чистка',
  'Настройка',
  'Профилактика',
  'Ремонт',
]

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
