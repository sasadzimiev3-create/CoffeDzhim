import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Mail,
  Menu,
  PackageOpen,
  Phone,
  Plus,
  Settings,
  Wrench,
  X,
} from 'lucide-react'
import './App.css'
import {
  chemistryOrderUnit,
  chemistryProducts,
  coffeeOrderUnit,
  coffeeProducts,
  equipmentProducts,
  formatPrice,
  orderUnitLabel,
  serviceItems,
  type CatalogProduct,
  type ChemistryProduct,
  type OrderUnit,
} from './data/catalog'
import {
  siteContacts,
  siteSocials,
  type SocialNetwork,
} from './data/site'
import { sendLead, type LeadSource } from './lib/leads'

type View =
  | 'home'
  | 'coffee'
  | 'tea'
  | 'accessories'
  | 'chemistry'
  | 'equipment'
  | 'service'
  | 'contacts'

const views: View[] = [
  'home',
  'coffee',
  'tea',
  'accessories',
  'chemistry',
  'equipment',
  'service',
  'contacts',
]

const navLinks: { id: View; label: string }[] = [
  { id: 'coffee', label: 'Кофе' },
  { id: 'equipment', label: 'Оборудование' },
  { id: 'tea', label: 'Чай' },
  { id: 'chemistry', label: 'Химия' },
  { id: 'service', label: 'Сервис' },
  { id: 'contacts', label: 'Контакты' },
]

const catalogCategories: {
  id: View
  number: string
  name: string
  count: string
  available: boolean
  description: string
  image?: string
  imageMode?: 'cutout' | 'photo'
  logo?: string
}[] = [
  {
    id: 'coffee',
    number: '01',
    name: 'Ingresso',
    logo: '/assets/ingresso-logo.png',
    count: '5 позиций',
    available: true,
    image: '/assets/coffee-brazil-cutout.png',
    imageMode: 'cutout',
    description:
      'Эспрессо, фильтр и дрип-кофе обжарки Ingresso — с профилями вкуса, фасовками и актуальными ценами.',
  },
  {
    id: 'equipment',
    number: '02',
    name: 'Оборудование',
    count: '3 позиции',
    available: true,
    image: '/assets/equipment-ottima-evo-2g-cutout.png',
    imageMode: 'cutout',
    description:
      'Профессиональные кофемашины, суперавтоматы и барное оборудование для кофейни, ресторана и точки с высокой проходимостью.',
  },
  {
    id: 'tea',
    number: '03',
    name: 'Чай',
    count: 'Скоро',
    available: false,
    description:
      'Листовой чай и купажи для чайной карты HoReCa — сорта, происхождение и форматы поставки появятся в этом разделе.',
  },
  {
    id: 'chemistry',
    number: '04',
    name: 'Химия и аксессуары',
    count: '4 позиции · аксессуары скоро',
    available: true,
    image: '/assets/chemistry-p63-cutout.png',
    imageMode: 'cutout',
    description:
      'Средства для очистки групп, молочных систем и удаления накипи. Аксессуары для бара добавим в этот же раздел.',
  },
]

const partners = [
  { name: 'Ingresso', logo: '/assets/partners/ingresso.png', fit: 'mark' },
  { name: 'Futurmat', logo: '/assets/partners/futurmat.svg', fit: 'word' },
  { name: 'Eureka', logo: '/assets/partners/eureka.png', fit: 'mark' },
  { name: 'WMF', logo: '/assets/partners/wmf.svg', fit: 'mark' },
  { name: 'Jetinno', logo: '/assets/partners/jetinno.png', fit: 'word' },
  { name: 'Barista Line', logo: '/assets/partners/barista-line.png', fit: 'wide' },
] as const

const coffeePath = [
  {
    id: 'plant',
    num: '01',
    title: 'Завод',
    text: 'Ростер Loring. Профиль партии задаётся на заводе.',
    image: '/assets/journey/plant.jpg',
    alt: 'Ростер Loring на обжарочном производстве',
  },
  {
    id: 'ship',
    num: '02',
    title: 'Доставка',
    text: 'Кофе уезжает на точку в той же обжарке.',
    image: '/assets/journey/ship.jpg',
    alt: 'Упаковки Ingresso на палете перед контейнером',
  },
  {
    id: 'cup',
    num: '03',
    title: 'Чашка',
    text: 'На баре зерно становится эспрессо.',
    image: '/assets/journey/cup.jpg',
    alt: 'Эспрессо в чашках Ingresso на кофемашине',
  },
] as const

const reviews = [
  {
    id: 'smena',
    kind: 'Кофейня',
    city: 'Санкт-Петербург',
    quote:
      'Зерно Ingresso держит один профиль от поставки к поставке. Бариста не перенастраивают помол каждую неделю, и эспрессо в карте не пляшет.',
    name: 'Мария Соколова',
    role: 'Управляющая, «Смена»',
    initials: 'МС',
  },
  {
    id: 'gavan',
    kind: 'Ресторан',
    city: 'Санкт-Петербург',
    quote:
      'Поставили Ottima на две группы и в тот же день настроили под наше зерно. Если группа капризничает, сервис приезжает на точку, а не записывает на следующую неделю.',
    name: 'Алексей Крылов',
    role: 'Шеф-бариста, «Тихая гавань»',
    initials: 'АК',
  },
  {
    id: 'kontur',
    kind: 'Офис',
    city: 'Санкт-Петербург',
    quote:
      'На сорок человек хватает одного суперавтомата и одной заявки: зерно, химия и фильтры приезжают вместе. Не ведём трёх поставщиков ради кофейной точки.',
    name: 'Ирина Волкова',
    role: 'Офис-менеджер, «Северный контур»',
    initials: 'ИВ',
  },
  {
    id: 'tretiy-stol',
    kind: 'Кофейня',
    city: 'Санкт-Петербург',
    quote:
      'Открывали точку с нуля. Машину, помол и ТТК на напитки собрали до запуска зала — в первую неделю не собирали карту на ходу.',
    name: 'Дмитрий Панин',
    role: 'Владелец, «Третий стол»',
    initials: 'ДП',
  },
  {
    id: 'dvorovye',
    kind: 'Сеть',
    city: 'Кудрово',
    quote:
      'Три точки, одна обжарка и одна цена. Накладные приходят сразу, а менеджер отвечает в Telegram, пока смена ещё не закрыта.',
    name: 'Ольга Белова',
    role: 'Закупки, «Дворовые»',
    initials: 'ОБ',
  },
  {
    id: 'polka',
    kind: 'Пекарня',
    city: 'Всеволожск',
    quote:
      'Раньше машину увозили в сервис на несколько дней. Сейчас диагностика и чистка проходят у нас, и бар стоит часы, а не всю смену.',
    name: 'Сергей Минин',
    role: 'Технический директор, «Тёплая полка»',
    initials: 'СМ',
  },
] as const

const promoSlides = [
  {
    id: 'futurmat',
    theme: 'machine',
    kicker: '2 группы · Tall LED',
    title: 'Quality Espresso Futurmat Ottima Evo 2G',
    price: '289 000 ₽',
    text: 'Выбирая Futurmat, вы инвестируете в безотказную работу и выносливость. По длительности эксплуатации и ценовой эффективности эта кофемашина занимает лидирующие позиции в своём классе.',
    offerLead: 'В подарок:',
    points: [
      'Диагностика оборудования',
      'Настроим оборудование на новое зерно',
      'Сделаем ТТК',
      'Бесплатно привезем по СПБ и ЛО',
      'Поможем выйти на новый уровень качества кофейных напитков',
    ],
    cta: 'Смотреть модель',
    href: '#equipment',
    image: '/assets/equipment-ottima-evo-2g-cutout.png',
    imageAlt: 'Кофемашина Quality Espresso Futurmat Ottima Evo 2G',
  },
  {
    id: 'coffee-offer',
    theme: 'coffee',
    kicker: 'Кофе Ingresso',
    title: '10 кг кофе',
    oldPrice: '22 220 ₽',
    price: '18 500 ₽',
    priceExtra: '+ пачка дрип-пакетов',
    offerLead: 'Наши компетенции:',
    points: [
      'Бесплатная диагностика оборудования',
      'Настроим оборудование на новое зерно',
      'Сделаем ТТК',
      'Бесплатно привезем по СПб и ЛО',
    ],
    cta: 'Выбрать кофе',
    href: '#coffee',
    image: '/assets/coffee-ingresso-offer.jpg',
    imageAlt: '10 кг кофе Ingresso и пачка дрип-пакетов',
  },
] as const

function getViewFromHash(): View {
  const hash = window.location.hash.replace('#', '')
  if (hash === 'service-request' || hash === 'service-page') return 'service'
  if (hash === 'contacts-page') return 'contacts'
  return views.includes(hash as View) ? (hash as View) : 'home'
}

function SocialIcon({ network }: { network: SocialNetwork }) {
  if (network === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          fill="currentColor"
          d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm8.2 1.6a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2Zm0 2a1.8 1.8 0 1 0 1.8 1.8A1.8 1.8 0 0 0 12 10.2Z"
        />
      </svg>
    )
  }
  if (network === 'telegram') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          fill="currentColor"
          d="M21.8 4.3 3.4 11.4c-1.3.5-1.2 1.2-.2 1.5l4.7 1.4 10.8-6.8c.5-.3 1-.1.6.2l-8.7 7.9-.3 4.5c.5 0 .7-.2 1-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.2-.4-1.8-1.4-1.4Z"
        />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M19.1 4.9A10 10 0 0 0 3.2 16.5L2 22l5.6-1.1A10 10 0 0 0 19.1 4.9Zm-7.1 15.3c-1.5 0-3-.4-4.3-1.1l-.3-.2-3.3.9.9-3.2-.2-.3a8.3 8.3 0 1 1 7.2 3.9Zm4.5-6.2c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1l-.8 1c-.2.2-.3.2-.6.1a6.8 6.8 0 0 1-3.3-2.9c-.2-.4 0-.5.1-.7l.5-.6c.1-.2.2-.3.2-.5s0-.4-.1-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3s-1 1-1 2.4 1 2.8 1.2 3 .2.3 2.1 3.2c1.7 1.5 2.3 1.7 3.1 2 .3.1.9.1 1.3.1s1.3-.3 1.5-.7.9-1.1 1-1.4-.1-.3-.3-.4Z"
      />
    </svg>
  )
}

function SocialLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`social-links ${compact ? 'social-links--compact' : ''}`}
      aria-label="Социальные сети"
    >
      {siteSocials.map((item) =>
        item.href ? (
          <a
            key={item.id}
            className="social-links__item"
            href={item.href}
            target="_blank"
            rel="noreferrer"
            aria-label={item.label}
          >
            <SocialIcon network={item.id} />
          </a>
        ) : (
          <span
            key={item.id}
            className="social-links__item is-soon"
            title={`${item.label} — ссылка появится позже`}
            aria-label={`${item.label}, ссылка появится позже`}
          >
            <SocialIcon network={item.id} />
          </span>
        ),
      )}
    </div>
  )
}

function PromoSlider() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef<number | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const count = promoSlides.length

  const goTo = (next: number) => {
    setPaused(true)
    setIndex(((next % count) + count) % count)
  }

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (paused || media.matches) return undefined
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count)
    }, 6500)
    return () => window.clearInterval(timer)
  }, [paused, count])

  useLayoutEffect(() => {
    const slider = sliderRef.current
    if (!slider) return undefined

    const alignPhoto = () => {
      const mobile = window.matchMedia('(max-width: 860px)').matches
      const machineSlide = slider.querySelector<HTMLElement>('.promo-slide--machine')
      const coffeeSlide = slider.querySelector<HTMLElement>('.promo-slide--coffee')
      const machineImg = machineSlide?.querySelector<HTMLImageElement>('img')
      const coffeeImg = coffeeSlide?.querySelector<HTMLImageElement>('img')
      if (!machineSlide || !coffeeSlide || !machineImg || !coffeeImg) return
      if (machineImg.getBoundingClientRect().height < 20) return

      if (mobile) {
        if (coffeeImg.style.marginTop || coffeeImg.style.maxHeight) {
          coffeeImg.style.marginTop = ''
          coffeeImg.style.maxHeight = ''
        }
        const machineBottom =
          machineImg.getBoundingClientRect().bottom - machineSlide.getBoundingClientRect().top
        const coffeeTop =
          coffeeImg.getBoundingClientRect().top - coffeeSlide.getBoundingClientRect().top
        const next = `${Math.max(160, Math.round(machineBottom - coffeeTop))}px`
        if (coffeeImg.style.height !== next) coffeeImg.style.height = next
        return
      }

      if (coffeeImg.style.height) coffeeImg.style.height = ''
      if (coffeeImg.style.marginTop) coffeeImg.style.marginTop = ''
      if (coffeeImg.style.maxHeight) coffeeImg.style.maxHeight = ''
    }

    const fit = () => {
      alignPhoto()
      const mobile = window.matchMedia('(max-width: 860px)').matches
      const slide = slider.querySelectorAll<HTMLElement>('.promo-slide')[index]
      if (!mobile || !slide) {
        slider.style.height = ''
        return
      }
      const next = `${slide.offsetHeight}px`
      if (slider.style.height !== next) slider.style.height = next
    }

    fit()
    const observer = new ResizeObserver(fit)
    slider.querySelectorAll('.promo-slide').forEach((slide) => observer.observe(slide))
    const images = slider.querySelectorAll('img')
    images.forEach((img) => {
      if (!img.complete) img.addEventListener('load', fit)
    })
    window.addEventListener('resize', fit)
    return () => {
      observer.disconnect()
      images.forEach((img) => img.removeEventListener('load', fit))
      window.removeEventListener('resize', fit)
      slider.style.height = ''
    }
  }, [index])

  return (
    <div
      ref={sliderRef}
      className="promo-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => {
        touchX.current = event.touches[0].clientX
      }}
      onTouchEnd={(event) => {
        if (touchX.current == null) return
        const delta = event.changedTouches[0].clientX - touchX.current
        if (Math.abs(delta) > 40) goTo(index + (delta < 0 ? 1 : -1))
        touchX.current = null
      }}
    >
      <div
        className="promo-slider__track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {promoSlides.map((slide) => (
          <article
            className={`promo-slide promo-slide--${slide.theme}`}
            key={slide.id}
            aria-hidden={slide.id !== promoSlides[index].id}
          >
            <div className="promo-slide__copy">
              {'kicker' in slide ? <p className="eyebrow">{slide.kicker}</p> : null}
              <h2>{slide.title}</h2>
              {'oldPrice' in slide && slide.oldPrice ? (
                <span className="promo-slide__price promo-slide__price--old">{slide.oldPrice}</span>
              ) : null}
              {'price' in slide && slide.price ? (
                <strong className="promo-slide__price">
                  {slide.price}
                  {'priceExtra' in slide && slide.priceExtra ? (
                    <span className="promo-slide__price-extra"> {slide.priceExtra}</span>
                  ) : null}
                </strong>
              ) : null}
              {'text' in slide && slide.text ? <p>{slide.text}</p> : null}
              {'points' in slide ? (
                <div className="promo-slide__offer">
                  <p className="promo-slide__offer-lead">{slide.offerLead}</p>
                  <ul>
                    {slide.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <a className="button button--light" href={slide.href}>
                {slide.cta}
                <ArrowRight size={18} />
              </a>
            </div>
            {'image' in slide && slide.image ? (
              <div className="promo-slide__visual">
                <img src={slide.image} alt={slide.imageAlt} />
                <span className="promo-slide__shadow" aria-hidden="true" />
              </div>
            ) : (
              <div className="promo-slide__visual promo-slide__visual--empty" />
            )}
          </article>
        ))}
      </div>

      <button
        className="promo-slider__arrow promo-slider__arrow--prev"
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label="Предыдущий баннер"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        className="promo-slider__arrow promo-slider__arrow--next"
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label="Следующий баннер"
      >
        <ChevronRight size={20} />
      </button>

      <div className="promo-slider__dots" role="tablist" aria-label="Баннеры">
        {promoSlides.map((slide, slideIndex) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-label={`Баннер ${slideIndex + 1}: ${slide.title}`}
            aria-selected={slideIndex === index}
            className={slideIndex === index ? 'is-active' : ''}
            onClick={() => goTo(slideIndex)}
          />
        ))}
      </div>
    </div>
  )
}

function ReviewsPanel() {
  const [index, setIndex] = useState(0)
  const touchX = useRef<number | null>(null)
  const count = reviews.length
  const review = reviews[index]

  const goTo = (next: number) => {
    setIndex(((next % count) + count) % count)
  }

  return (
    <section className="reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">04 / Отзывы</p>
          <h2 id="reviews-title">
            Заведения о зерне,
            <br />
            технике и <em>сервисе</em>
          </h2>
        </div>
        <p>
          Кофейни, рестораны и офисы Петербурга — как проходит поставка и
          обслуживание на точке.
        </p>
      </div>

      <div
        className="reviews__panel"
        data-reveal
        onTouchStart={(event) => {
          touchX.current = event.touches[0].clientX
        }}
        onTouchEnd={(event) => {
          if (touchX.current == null) return
          const delta = event.changedTouches[0].clientX - touchX.current
          if (Math.abs(delta) > 40) goTo(index + (delta < 0 ? 1 : -1))
          touchX.current = null
        }}
      >
        <div className="reviews__viewport">
          <div
            className="reviews__track"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {reviews.map((item, slideIndex) => (
              <article
                className="reviews__slide"
                key={item.id}
                aria-hidden={slideIndex !== index}
              >
                <div className="reviews__copy">
                  <p className="eyebrow">
                    {item.kind} · {item.city}
                  </p>
                  <blockquote>
                    <p>{item.quote}</p>
                  </blockquote>
                </div>
                <footer className="reviews__person">
                  <span className="reviews__num">0{slideIndex + 1}</span>
                  <div className="reviews__identity">
                    <span className="reviews__initials" aria-hidden="true">
                      {item.initials}
                    </span>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.role}</span>
                    </div>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </div>

        <div className="reviews__controls">
          <button
            className="reviews__arrow"
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Предыдущий отзыв"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="reviews__dots" role="tablist" aria-label="Отзывы">
            {reviews.map((item, slideIndex) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-label={`${item.name}, ${item.role}`}
                aria-selected={slideIndex === index}
                className={slideIndex === index ? 'is-active' : ''}
                onClick={() => goTo(slideIndex)}
              />
            ))}
          </div>
          <button
            className="reviews__arrow"
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Следующий отзыв"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <p className="reviews__live" aria-live="polite">
          {review.name}. {review.role}. {review.quote}
        </p>
      </div>
    </section>
  )
}

function BrandLogo({ footer = false }: { footer?: boolean }) {
  return (
    <a
      className={`brand ${footer ? 'brand--footer' : ''}`}
      href="#home"
      aria-label="CoffeDzhim.ru — на главную"
    >
      <img
        className="brand__logo"
        src="/assets/logo.png"
        alt="CoffeDzhim.ru"
      />
    </a>
  )
}

function SiteHeader({
  view,
  menuOpen,
  setMenuOpen,
}: {
  view: View
  menuOpen: boolean
  setMenuOpen: (value: boolean) => void
}) {
  return (
    <header className="site-header">
      <BrandLogo />
      <nav className="desktop-nav" aria-label="Главная навигация">
        {navLinks.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={view === link.id ? 'is-active' : ''}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <a className="header-cta" href="#contacts">
        Связаться
        <ArrowUpRight size={15} />
      </a>
      <button
        className="menu-toggle"
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X /> : <Menu />}
      </button>
    </header>
  )
}

function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: ReactNode
  description?: string
}) {
  return (
    <section className="page-hero">
      <div className="page-hero__inner">
        <a className="page-back" href="#home">
          <ArrowLeft size={14} />
          Каталог
        </a>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="page-hero__copy">{description}</p>}
      </div>
    </section>
  )
}

function QuantityStepper({
  value,
  unit,
  onChange,
}: {
  value: number
  unit: OrderUnit
  onChange: (value: number) => void
}) {
  const label = orderUnitLabel(unit)
  const setQuantity = (next: number) => {
    if (!Number.isFinite(next)) return
    onChange(Math.min(999, Math.max(1, Math.round(next))))
  }

  return (
    <div className="qty">
      <span className="qty__label">Количество</span>
      <div className="qty__controls">
        <button
          type="button"
          onClick={() => setQuantity(value - 1)}
          disabled={value <= 1}
          aria-label="Уменьшить количество"
        >
          −
        </button>
        <input
          className="qty__input"
          type="number"
          inputMode="numeric"
          min={1}
          max={999}
          value={value}
          aria-label={`Количество, ${label}`}
          onChange={(event) => {
            const raw = event.target.value
            if (raw === '') return
            setQuantity(Number(raw))
          }}
        />
        <span className="qty__unit">{label}</span>
        <button
          type="button"
          onClick={() => setQuantity(value + 1)}
          disabled={value >= 999}
          aria-label="Увеличить количество"
        >
          +
        </button>
      </div>
    </div>
  )
}

function ProductCard({
  product,
  index,
  onOpen,
  onBuy,
}: {
  product: CatalogProduct
  index: number
  onOpen: (product: CatalogProduct) => void
  onBuy: (product: CatalogProduct, quantity: number) => void
}) {
  const unit = coffeeOrderUnit(product)
  const [quantity, setQuantity] = useState(1)
  const startingPrice = product.variants?.[0]?.price
  const variantPrices = product.variants?.map((variant) => variant.price) ?? []
  const fromPrefix =
    variantPrices.length > 1 &&
    Math.min(...variantPrices) !== Math.max(...variantPrices)
      ? 'от '
      : ''
  const imageMode = product.imageMode ?? 'cutout'
  const shownPrice = startingPrice ? startingPrice * quantity : null
  return (
    <article
      className={`product-card product-card--${imageMode}`}
      data-reveal
      style={{ '--card-accent': product.accent } as CSSProperties}
    >
      <button
        className="product-card__button"
        type="button"
        onClick={() => onOpen(product)}
        aria-label={`Подробнее о ${product.name}`}
      >
        <div className="product-card__visual">
          <span className="product-card__index">0{index + 1}</span>
          <img src={product.image} alt={product.name} loading="lazy" />
          {imageMode === 'cutout' ? (
            <span className="product-card__shadow" aria-hidden="true" />
          ) : null}
          <span className="product-card__arrow">
            <ArrowUpRight size={18} />
          </span>
        </div>
        <div className="product-card__meta">
          <p className="eyebrow">{product.kind}</p>
          <h3>{product.name}</h3>
          <ul className="product-card__notes">
            {product.notes.slice(0, 3).map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <div className="product-card__footer">
            <span>Подробнее</span>
            <strong>
              {shownPrice
                ? `${quantity > 1 ? '' : fromPrefix}${formatPrice(shownPrice)}`
                : product.price
                  ? formatPrice(product.price)
                  : product.priceLabel}
            </strong>
          </div>
        </div>
      </button>
      <div className="product-card__buy">
        <QuantityStepper value={quantity} unit={unit} onChange={setQuantity} />
        <button
          className="button button--dark button--wide"
          type="button"
          onClick={() => onBuy(product, quantity)}
        >
          Купить
          <ArrowUpRight size={18} />
        </button>
      </div>
    </article>
  )
}

function productPriceText(product: CatalogProduct) {
  if (product.price) return formatPrice(product.price)
  return product.priceLabel ?? ''
}

function ProductModal({
  product,
  onClose,
  onBuy,
}: {
  product: CatalogProduct
  onClose: () => void
  onBuy: (
    product: CatalogProduct,
    order: { quantity: number; unitPrice: number },
  ) => void
}) {
  const [variantIndex, setVariantIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const selectedVariant = product.variants?.[variantIndex]
  const unit = product.variants ? coffeeOrderUnit(product) : null
  const unitPrice = selectedVariant?.price ?? product.price ?? 0
  const unitText = unit ? orderUnitLabel(unit) : ''

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.classList.add('modal-open')
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          <X size={20} />
        </button>

        <div
          className={`product-modal__visual product-modal__visual--${product.imageMode ?? 'cutout'}`}
          style={{ '--card-accent': product.accent } as CSSProperties}
        >
          <p className="eyebrow">{product.kind}</p>
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-modal__content">
          <p className="eyebrow">Подробно о продукте</p>
          <h2>{product.name}</h2>
          <p className="product-modal__lead">{product.lead}</p>
          <p className="product-modal__description">{product.description}</p>

          <div className="taste-notes">
            {product.notes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>

          {product.variants && product.variants.length > 1 ? (
            <div className="variant-picker">
              <p>Выберите формат</p>
              <div>
                {product.variants.map((variant, index) => (
                  <button
                    type="button"
                    className={index === variantIndex ? 'is-active' : ''}
                    onClick={() => setVariantIndex(index)}
                    key={variant.label}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {unit ? (
            <QuantityStepper value={quantity} unit={unit} onChange={setQuantity} />
          ) : null}

          <div className="modal-price">
            <span>
              {unit
                ? `${quantity} ${unitText} · ${formatPrice(unitPrice)} / ${unitText}`
                : 'Актуальная цена'}
            </span>
            <strong>
              {unit ? formatPrice(unitPrice * quantity) : productPriceText(product)}
            </strong>
          </div>

          <button
            className="button button--dark button--wide product-modal__buy"
            type="button"
            onClick={() =>
              onBuy(product, {
                quantity: unit ? quantity : 1,
                unitPrice,
              })
            }
          >
            Купить
            <ArrowUpRight size={18} />
          </button>

          <dl className="spec-list">
            {product.specs.map((spec) => (
              <div key={`${spec.label}-${spec.value}`}>
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>

          <a
            className="source-link"
            href={product.source}
            target="_blank"
            rel="noreferrer"
          >
            Проверить в источнике: {product.sourceLabel}
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </div>
  )
}

function HomeView({
  onOpen,
  onBuy,
}: {
  onOpen: (product: CatalogProduct) => void
  onBuy: (product: CatalogProduct, quantity: number) => void
}) {
  return (
    <>
      <section className="promo-hero" id="top">
        <PromoSlider />
      </section>

      <section className="catalog-index" id="home-catalog">
        <div className="catalog-index__photo" aria-hidden="true" />
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow">01 / Каталог</p>
            <h2>
              Выберите <em>категорию</em>
            </h2>
          </div>
          <p>
            Кофе, техника, чай и химия для бара — в одном месте, с живыми
            ценами и понятной поставкой.
          </p>
        </div>
        <div className="category-nav" data-reveal>
          {catalogCategories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className={`category-nav__item category-nav__item--${category.id} ${
                category.logo ? 'category-nav__item--brand' : ''
              } ${category.available ? '' : 'category-nav__item--soon'}`}
            >
              <div className="category-nav__copy">
                <span className="category-nav__num">{category.number}</span>
                <h3>
                  {category.logo ? (
                    <img
                      className="category-nav__logo"
                      src={category.logo}
                      alt=""
                    />
                  ) : null}
                  {category.name}
                </h3>
                <p>{category.description}</p>
                <span className="category-nav__count">{category.count}</span>
              </div>
              <div className="category-nav__visual">
                {category.image ? (
                  <img src={category.image} alt="" />
                ) : (
                  <Leaf className="category-nav__mark" size={172} strokeWidth={1.25} />
                )}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="featured-coffee">
        <div className="featured-coffee__photo" aria-hidden="true" />
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow">02 / Обжарка</p>
            <h2>
              Кофе, который стоит
              <br />
              поставить <em>в карту</em>
            </h2>
          </div>
          <a className="text-link" href="#coffee">
            Весь каталог
            <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="product-grid product-grid--featured">
          {coffeeProducts.slice(0, 4).map((product, index) => (
            <ProductCard
              product={product}
              index={index}
              onOpen={onOpen}
              onBuy={onBuy}
              key={product.id}
            />
          ))}
        </div>
      </section>

      <section className="partners" id="partners">
        <div className="partners__brands" data-reveal>
          <div className="partners__head">
            <p className="eyebrow">03 / Партнёры</p>
            <h2>
              Бренды,
              <br />
              с которыми
              <br />
              <em>работаем</em>
            </h2>
          </div>
          <ul className="partners__list">
            {partners.map((partner) => (
              <li key={partner.name}>
                <img
                  className={`partners__logo partners__logo--${partner.fit}`}
                  src={partner.logo}
                  alt={partner.name}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="partners__journey" data-reveal>
          <div className="partners__head">
            <p className="eyebrow">Путь зерна</p>
            <h2>
              От обжарки
              <br />
              до <em>чашки</em>
            </h2>
          </div>
          <div className="path">
            <ol>
              {coffeePath.map((step) => (
                <li key={step.id} className={`path__step path__step--${step.id}`}>
                  <figure className={`path__photo path__photo--${step.id}`}>
                    <img src={step.image} alt={step.alt} />
                  </figure>
                  <div className="path__copy">
                    <h3>
                      <span className="path__num">{step.num}</span>
                      {step.title}
                    </h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <span className="path__bridge path__bridge--to-ship" aria-hidden="true" />
            <span className="path__bridge path__bridge--to-cup" aria-hidden="true" />
          </div>
        </div>
      </section>

      <ReviewsPanel />

      <section className="home-cta" data-reveal>
        <div>
          <p className="eyebrow">Готовы обсудить проект?</p>
          <h2>
            Подберём кофе, технику
            <br />
            и <em>обслуживание</em>
          </h2>
        </div>
        <a className="button button--dark" href="#contacts">
          Связаться с нами
          <ArrowUpRight size={18} />
        </a>
      </section>
    </>
  )
}

function CoffeeView({
  onOpen,
  onBuy,
}: {
  onOpen: (product: CatalogProduct) => void
  onBuy: (product: CatalogProduct, quantity: number) => void
}) {
  return (
    <>
      <PageHero
        eyebrow="Каталог · 01 / Кофе Ingresso"
        title={
          <>
            Кофе
            <br />
            <em>Ingresso</em>
          </>
        }
        description="Эспрессо, фильтр и дрип-форматы для заведений. Выберите килограммы или упаковки и оставьте заявку на поставку."
      />
      <section className="coffee-section section-dark">
        <div className="product-grid">
          {coffeeProducts.map((product, index) => (
            <ProductCard
              product={product}
              index={index}
              onOpen={onOpen}
              onBuy={onBuy}
              key={product.id}
            />
          ))}
        </div>
      </section>
    </>
  )
}

function ChemistryCard({
  product,
  index,
  onBuy,
}: {
  product: ChemistryProduct
  index: number
  onBuy: (product: ChemistryProduct, quantity: number) => void
}) {
  const unit = chemistryOrderUnit(product)
  const [quantity, setQuantity] = useState(1)

  return (
    <article className="chemistry-card" data-reveal>
      <div className="chemistry-card__visual">
        <span className="chemistry-card__number">0{index + 1}</span>
        <img
          src={product.image}
          alt={`${product.name} ${product.code}`}
          loading="lazy"
        />
      </div>
      <p className="eyebrow">Профессиональный уход</p>
      <h3>{product.name}</h3>
      <div className="chemistry-card__foot">
        <div className="chemistry-card__bottom">
          <span>
            {product.code} · {product.volume}
          </span>
          <strong>{formatPrice(product.price * quantity)}</strong>
        </div>
        <QuantityStepper value={quantity} unit={unit} onChange={setQuantity} />
        <button
          className="button button--dark button--wide"
          type="button"
          onClick={() => onBuy(product, quantity)}
        >
          Купить
          <ArrowUpRight size={18} />
        </button>
      </div>
    </article>
  )
}

function ChemistryView({
  onBuy,
}: {
  onBuy: (product: ChemistryProduct, quantity: number) => void
}) {
  return (
    <>
      <PageHero
        eyebrow="Каталог · 04 / Химия и аксессуары"
        title={
          <>
            Чистота — часть
            <br />
            <em>вкуса</em>
          </>
        }
        description="Профессиональная химия для ухода за кофейным оборудованием. Количество — от 1 кг или 1 штуки. Аксессуары для бара появятся в этом же разделе."
      />
      <section className="chemistry-section section-dark">
        <div className="chemistry-grid">
          {chemistryProducts.map((product, index) => (
            <ChemistryCard
              product={product}
              index={index}
              onBuy={onBuy}
              key={product.code}
            />
          ))}
        </div>
        <a className="accessories-teaser" href="#contacts" data-reveal>
          <span className="accessories-teaser__icon">
            <PackageOpen size={22} />
          </span>
          <div>
            <p className="eyebrow">Аксессуары · скоро</p>
            <h3>Инструменты бариста и детали бара</h3>
            <p>
              Темперы, питчеры, посуда и расходники добавим сюда же, рядом с
              химией для ежедневного ухода.
            </p>
          </div>
          <span className="accessories-teaser__cta">
            Оставить заявку
            <ArrowUpRight size={18} />
          </span>
        </a>
      </section>
    </>
  )
}

function EquipmentView({
  onOpen,
  onBuy,
}: {
  onOpen: (product: CatalogProduct) => void
  onBuy: (product: CatalogProduct) => void
}) {
  return (
    <>
      <PageHero
        eyebrow="Каталог · 02 / Оборудование"
        title={
          <>
            Техника для
            <br />
            <em>стабильного результата</em>
          </>
        }
        description="Кофемашины, суперавтоматы и барное оборудование для кофейни, ресторана и точки с высокой проходимостью. Подберём модель под поток и формат заведения."
      />
      <section className="equipment-section section-dark">
        <div className="equipment-list">
          {equipmentProducts.map((product, index) => (
            <article
              className="equipment-card"
              key={product.id}
              data-reveal
              style={{ '--card-accent': product.accent } as CSSProperties}
            >
              <div className="equipment-card__topline">
                <span>0{index + 1}</span>
                <span>{product.kind}</span>
              </div>
              <div className="equipment-card__visual">
                <img src={product.image} alt={product.name} loading="lazy" />
              </div>
              <div className="equipment-card__copy">
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.lead}</p>
                </div>
                <div className="equipment-card__actions">
                  <p className="equipment-card__price">
                    <span>Цена</span>
                    <strong>{productPriceText(product)}</strong>
                  </p>
                  <button
                    className="equipment-card__more"
                    type="button"
                    onClick={() => onOpen(product)}
                  >
                    Подробнее
                    <ArrowUpRight size={18} />
                  </button>
                  <button
                    className="button button--dark button--wide"
                    type="button"
                    onClick={() => onBuy(product)}
                  >
                    Купить
                    <ArrowUpRight size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

function LeadForm({
  source,
  buttonLabel,
  product,
  priceLabel,
  embedded = false,
}: {
  source: LeadSource
  buttonLabel: string
  product?: string
  priceLabel?: string
  embedded?: boolean
}) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  )
  const [error, setError] = useState('')

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setStatus('sending')
    setError('')
    try {
      await sendLead({
        source,
        name: String(data.get('name') || ''),
        phone: String(data.get('phone') || ''),
        contact: String(data.get('contact') || ''),
        comment: String(data.get('comment') || ''),
        serviceType: String(data.get('serviceType') || ''),
        product,
        priceLabel,
      })
      form.reset()
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setError(
        err instanceof Error ? err.message : 'Не удалось отправить заявку',
      )
    }
  }

  return (
    <form
      className="contact-form"
      onSubmit={onSubmit}
      onInput={() => {
        if (status === 'sent' || status === 'error') setStatus('idle')
      }}
      {...(embedded ? {} : { 'data-reveal': true })}
    >
      {source === 'service' && (
        <label>
          <span>Что нужно</span>
          <select name="serviceType" defaultValue="">
            <option value="">Выберите услугу</option>
            {serviceItems.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
            <option value="Другое">Другое</option>
          </select>
        </label>
      )}
      <label>
        <span>Имя</span>
        <input
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={80}
          placeholder="Как к вам обращаться?"
        />
      </label>
      <label>
        <span>Телефон</span>
        <input
          name="phone"
          type="tel"
          required
          placeholder="+7 (___) ___-__-__"
        />
      </label>
      <label>
        <span>Telegram / Email</span>
        <input
          name="contact"
          type="text"
          maxLength={120}
          placeholder="@username или mail@example.ru"
        />
      </label>
      <label>
        <span>Комментарий</span>
        <textarea
          name="comment"
          rows={3}
          maxLength={1000}
          placeholder={
            source === 'service'
              ? 'Модель машины, что случилось, когда удобно приехать'
              : source === 'purchase'
                ? 'Доставка, юрлицо или комментарий к заказу'
                : 'Расскажите, что вам нужно'
          }
        />
      </label>
      <button
        className="button button--dark button--wide"
        type="submit"
        disabled={status === 'sending'}
      >
        {status === 'sending' ? 'Отправляем…' : buttonLabel}
        <ArrowUpRight size={18} />
      </button>
      {status === 'sent' ? (
        <p className="form-success">
          <Check size={17} />
          {source === 'purchase'
            ? 'Заявка на покупку отправлена. Менеджер получил её в Telegram и свяжется с вами.'
            : 'Заявка отправлена. Менеджер получил её в Telegram и свяжется с вами.'}
        </p>
      ) : status === 'error' ? (
        <p className="form-error">{error}</p>
      ) : (
        <p className="form-note">
          {source === 'purchase'
            ? 'Заявка на покупку сразу придёт менеджеру в Telegram — с позицией, количеством и вашими контактами.'
            : 'Заявка сразу придёт менеджеру в Telegram — с вашими данными и временем обращения.'}
        </p>
      )}
    </form>
  )
}

type PurchaseRequest = {
  id: string
  name: string
  unitPrice: number
  unit: OrderUnit | null
  quantity: number
}

function coffeePurchase(
  product: CatalogProduct,
  quantity = 1,
  unitPrice = product.variants?.[0]?.price ?? product.price ?? 0,
): PurchaseRequest {
  return {
    id: product.id,
    name: product.name,
    unitPrice,
    unit: product.variants ? coffeeOrderUnit(product) : null,
    quantity,
  }
}

function equipmentPurchase(product: CatalogProduct): PurchaseRequest {
  return {
    id: product.id,
    name: product.name,
    unitPrice: product.price ?? 0,
    unit: null,
    quantity: 1,
  }
}

function chemistryPurchase(
  product: ChemistryProduct,
  quantity = 1,
): PurchaseRequest {
  return {
    id: product.code,
    name: `${product.name} (${product.code})`,
    unitPrice: product.price,
    unit: chemistryOrderUnit(product),
    quantity,
  }
}

function PurchaseModal({
  request,
  onClose,
}: {
  request: PurchaseRequest
  onClose: () => void
}) {
  const [quantity, setQuantity] = useState(request.quantity)

  useEffect(() => {
    setQuantity(request.quantity)
  }, [request.id, request.quantity])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.classList.add('modal-open')
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const unitText = request.unit ? orderUnitLabel(request.unit) : ''
  const total = request.unitPrice * (request.unit ? quantity : 1)
  const priceText = request.unit
    ? `${formatPrice(total)} за ${quantity} ${unitText}`
    : formatPrice(request.unitPrice)
  const productLine = request.unit
    ? `${request.name} · ${quantity} ${unitText}`
    : request.name

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="purchase-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchase-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          <X size={20} />
        </button>
        <p className="eyebrow">Покупка</p>
        <h2 id="purchase-title">{request.name}</h2>
        {request.unit ? (
          <>
            <p className="purchase-modal__unit">
              {formatPrice(request.unitPrice)} / {unitText}
            </p>
            <QuantityStepper
              value={quantity}
              unit={request.unit}
              onChange={setQuantity}
            />
          </>
        ) : null}
        <p className="purchase-modal__price">{priceText}</p>
        <p className="purchase-modal__hint">
          Оставьте контакты — менеджер получит заявку на покупку в Telegram и
          свяжется с вами.
        </p>
        <LeadForm
          source="purchase"
          buttonLabel="Отправить заявку"
          product={productLine}
          priceLabel={priceText}
          embedded
        />
      </div>
    </div>
  )
}

function ComingSoonView({
  eyebrow,
  title,
  description,
  icon,
}: {
  eyebrow: string
  title: string
  description: string
  icon: ReactNode
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} />
      <section className="coming-soon">
        <div className="coming-soon__inner">
          <span className="coming-soon__icon">{icon}</span>
          <span className="coming-soon__status">Скоро</span>
          <p>{description}</p>
          <a className="button button--dark" href="#contacts">
            Оставить заявку
            <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
    </>
  )
}

function ServiceView() {
  return (
    <>
      <section className="service-section" id="service-page">
      <div className="service-image" data-reveal>
        <img
          src="/assets/service-coffee-machine.jpg"
          alt="Обслуживание профессиональной кофемашины"
          loading="lazy"
        />
        <span className="service-image__badge">
          <Wrench size={20} />
          Техническая экспертиза
        </span>
      </div>
      <div className="service-content" data-reveal>
        <a className="page-back page-back--dark" href="#home">
          <ArrowLeft size={14} />
          На главную
        </a>
        <p className="eyebrow">Сервис оборудования</p>
        <h2>
          Машина должна
          <br />
          работать <em>точно</em>
        </h2>
        <p className="large-copy">
          Комплексный уход за кофейным оборудованием — от плановой чистки до
          диагностики и ремонта.
        </p>
        <div className="service-list">
          {serviceItems.map((item, index) => (
            <div key={item}>
              <span>0{index + 1}</span>
              <p>{item}</p>
              {index === 0 ? <Settings size={20} /> : <Plus size={20} />}
            </div>
          ))}
        </div>
        <a
          className="button button--copper"
          href="#service-request"
          onClick={(event) => {
            event.preventDefault()
            document
              .getElementById('service-request')
              ?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Оставить заявку
          <ArrowRight size={18} />
        </a>
      </div>
    </section>
      <section className="service-request" id="service-request">
        <div className="service-request__intro" data-reveal>
          <p className="eyebrow">Заявка на сервис</p>
          <h2>
            Оставьте заявку
            <br />
            на <em>обслуживание</em>
          </h2>
          <p>
            Напишите, что случилось с машиной — менеджер получит заявку сразу в
            Telegram, с вашими контактами и временем обращения.
          </p>
        </div>
        <LeadForm source="service" buttonLabel="Отправить заявку" />
      </section>
    </>
  )
}

function ContactsView() {
  return (
    <section className="contact-section" id="contacts-page">
      <div className="contact-intro" data-reveal>
        <a className="page-back page-back--dark" href="#home">
          <ArrowLeft size={14} />
          На главную
        </a>
        <p className="eyebrow">Контакты</p>
        <h2>
          Давайте обсудим
          <br />
          <em>вашу задачу</em>
        </h2>
        <p>
          Подберём кофе, оборудование или формат обслуживания под ваш проект.
        </p>
        <div className="contact-placeholders">
          <div>
            <span>Телефон</span>
            <p>
              <a href={siteContacts.phoneHref}>{siteContacts.phoneDisplay}</a>
            </p>
          </div>
          <div>
            <span>Email</span>
            <p>
              <a href={siteContacts.emailHref}>{siteContacts.email}</a>
            </p>
          </div>
          <div>
            <span>Соцсети</span>
            <SocialLinks />
          </div>
        </div>
      </div>

      <LeadForm source="contacts" buttonLabel="Получить консультацию" />
    </section>
  )
}

function App() {
  const [selectedProduct, setSelectedProduct] =
    useState<CatalogProduct | null>(null)
  const [purchaseRequest, setPurchaseRequest] =
    useState<PurchaseRequest | null>(null)
  const [view, setView] = useState<View>(getViewFromHash())
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleHashChange = () => {
      setView(getViewFromHash())
      setMenuOpen(false)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    const frame = window.requestAnimationFrame(() => {
      if (hash === 'service-request') {
        document
          .getElementById('service-request')
          ?.scrollIntoView({ behavior: 'smooth' })
        return
      }
      window.scrollTo({ top: 0, behavior: 'auto' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [view])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible')
        })
      },
      { threshold: 0.12 },
    )
    const elements = document.querySelectorAll('[data-reveal]')
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [view])

  const closeMenu = () => setMenuOpen(false)

  return (
    <main>
      <SiteHeader view={view} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className={`mobile-menu ${menuOpen ? 'is-open' : ''}`}>
        <nav aria-label="Мобильная навигация">
          {navLinks.map((link, index) => (
            <a key={link.id} href={`#${link.id}`} onClick={closeMenu}>
              {link.label} <span>0{index + 1}</span>
            </a>
          ))}
        </nav>
      </div>

      {view === 'home' && (
        <HomeView
          onOpen={setSelectedProduct}
          onBuy={(product, quantity) =>
            setPurchaseRequest(coffeePurchase(product, quantity))
          }
        />
      )}
      {view === 'coffee' && (
        <CoffeeView
          onOpen={setSelectedProduct}
          onBuy={(product, quantity) =>
            setPurchaseRequest(coffeePurchase(product, quantity))
          }
        />
      )}
      {(view === 'chemistry' || view === 'accessories') && (
        <ChemistryView
          onBuy={(product, quantity) =>
            setPurchaseRequest(chemistryPurchase(product, quantity))
          }
        />
      )}
      {view === 'equipment' && (
        <EquipmentView
          onOpen={setSelectedProduct}
          onBuy={(product) => setPurchaseRequest(equipmentPurchase(product))}
        />
      )}
      {view === 'tea' && (
        <ComingSoonView
          eyebrow="Каталог · 03 / Чай"
          title="Чай"
          description="Готовим чайную карту для HoReCa: листовые сорта, купажи и форматы поставки. Оставьте заявку — сообщим, когда ассортимент появится на сайте."
          icon={<Leaf size={30} />}
        />
      )}
      {view === 'service' && <ServiceView />}
      {view === 'contacts' && <ContactsView />}

      <footer className="site-footer">
        <div className="footer-brand">
          <BrandLogo footer />
          <p>
            Сайт для B2B: кофе, оборудование и сервис для кофеен, ресторанов и
            офисов.
          </p>
        </div>
        <div className="footer-meta">
          <div className="footer-contacts">
            <a href={siteContacts.phoneHref}>
              <Phone size={14} />
              {siteContacts.phoneDisplay}
            </a>
            <a href={siteContacts.emailHref}>
              <Mail size={14} />
              {siteContacts.email}
            </a>
          </div>
          <SocialLinks compact />
        </div>
        <a className="footer-top" href="#home">
          Наверх
          <ChevronRight size={15} />
        </a>
      </footer>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onBuy={(product, order) => {
            const request = equipmentProducts.some((item) => item.id === product.id)
              ? equipmentPurchase(product)
              : coffeePurchase(product, order.quantity, order.unitPrice)
            setSelectedProduct(null)
            setPurchaseRequest(request)
          }}
        />
      )}
      {purchaseRequest && (
        <PurchaseModal
          request={purchaseRequest}
          onClose={() => setPurchaseRequest(null)}
        />
      )}
    </main>
  )
}

export default App
