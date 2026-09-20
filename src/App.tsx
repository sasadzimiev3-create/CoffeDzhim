import { useEffect, useRef, useState } from 'react'
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
  Sparkles,
  Wrench,
  X,
} from 'lucide-react'
import './App.css'
import {
  chemistryProducts,
  coffeeProducts,
  equipmentProducts,
  formatPrice,
  serviceItems,
  type CatalogProduct,
} from './data/catalog'
import {
  siteContacts,
  siteSocials,
  type SocialNetwork,
} from './data/site'

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
}[] = [
  {
    id: 'coffee',
    number: '01',
    name: 'Кофе Ingresso',
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
    image: '/assets/equipment-futurmat-cutout.png',
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

const promoSlides = [
  {
    id: 'futurmat',
    theme: 'machine',
    kicker: 'Оборудование для бара',
    title: 'Futurmat Ottima Evo',
    text: 'Профессиональная эспрессо-машина для кофейни и ресторана. Подберём конфигурацию под ваш поток и поможем запустить бар.',
    cta: 'Смотреть модель',
    href: '#equipment',
    image: '/assets/equipment-futurmat-cutout.png',
    imageAlt: 'Кофемашина Futurmat Ottima Evo',
  },
  {
    id: 'coffee-offer',
    theme: 'coffee',
    kicker: 'Кофе Ingresso',
    title: '10 кг кофе',
    price: '18 500 ₽',
    text: 'Оптовая цена для HoReCa. Подскажем профиль под эспрессо, молоко и вашу карту напитков.',
    cta: 'Выбрать кофе',
    href: '#coffee',
    image: '/assets/coffee-brazil-cutout.png',
    imageAlt: 'Кофе Ingresso Бразилия Серрадо',
  },
  {
    id: 'audit',
    theme: 'audit',
    kicker: 'Сервис и аудит',
    title: 'Разберём ваш бар бесплатно',
    text: 'Зерно, оборудование и сервис — покажем, где теряются вкус и маржа, и что стоит поменять в первую очередь.',
    cta: 'Оставить заявку',
    href: '#contacts',
  },
] as const

function getViewFromHash(): View {
  const hash = window.location.hash.replace('#', '') as View
  return views.includes(hash) ? hash : 'home'
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

  return (
    <div
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
              <p className="eyebrow">{slide.kicker}</p>
              <h2>{slide.title}</h2>
              {'price' in slide && slide.price ? (
                <strong className="promo-slide__price">{slide.price}</strong>
              ) : null}
              <p>{slide.text}</p>
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

function ProductCard({
  product,
  index,
  onOpen,
}: {
  product: CatalogProduct
  index: number
  onOpen: (product: CatalogProduct) => void
}) {
  const startingPrice = product.variants?.[0]?.price
  const imageMode = product.imageMode ?? 'cutout'
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
              {startingPrice
                ? `от ${formatPrice(startingPrice)}`
                : product.price
                  ? formatPrice(product.price)
                  : product.priceLabel}
            </strong>
          </div>
        </div>
      </button>
    </article>
  )
}

function ProductModal({
  product,
  onClose,
}: {
  product: CatalogProduct
  onClose: () => void
}) {
  const [variantIndex, setVariantIndex] = useState(0)
  const selectedVariant = product.variants?.[variantIndex]

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

          {product.variants && (
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
          )}

          <div className="modal-price">
            <span>Актуальная цена</span>
            <strong>
              {selectedVariant
                ? formatPrice(selectedVariant.price)
                : product.price
                  ? formatPrice(product.price)
                  : product.priceLabel}
            </strong>
          </div>

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
}: {
  onOpen: (product: CatalogProduct) => void
}) {
  return (
    <>
      <section className="promo-hero" id="top">
        <PromoSlider />
      </section>

      <section className="home-stats" aria-label="Направления">
        <div>
          <strong>Кофе Ingresso</strong>
          <span>Эспрессо, фильтр и дрип с понятными профилями вкуса</span>
        </div>
        <div>
          <strong>Оборудование</strong>
          <span>Машины и барная техника под поток заведения</span>
        </div>
        <div>
          <strong>Сервис</strong>
          <span>Аудит, чистка, настройка и ремонт без простоя бара</span>
        </div>
      </section>

      <section className="catalog-index" id="home-catalog">
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
              className={`category-nav__item ${
                category.available ? '' : 'category-nav__item--soon'
              }`}
            >
              <div className="category-nav__copy">
                <span className="category-nav__num">{category.number}</span>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span className="category-nav__count">{category.count}</span>
              </div>
              <div className="category-nav__visual">
                {category.image ? (
                  <img src={category.image} alt="" />
                ) : (
                  <Leaf size={42} />
                )}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="featured-coffee">
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
              key={product.id}
            />
          ))}
        </div>
      </section>

      <section className="roaster-section" id="roaster">
        <div className="roaster-portrait" data-reveal>
          <div className="portrait-placeholder">
            <span>Фото</span>
            <p>Место для портрета обжарщика</p>
          </div>
          <p className="image-caption">Roaster portrait / coming soon</p>
        </div>
        <div className="roaster-copy" data-reveal>
          <p className="eyebrow">03 / История</p>
          <h2>
            Обжарщик —<br />
            <em>автор вкуса</em>
          </h2>
          <p className="large-copy">
            Здесь появится история человека, который отвечает за профиль,
            баланс и характер каждой обжарки.
          </p>
          <div className="placeholder-note">
            <Sparkles size={19} />
            <p>
              Имя, фотография и авторский текст будут добавлены после
              согласования.
            </p>
          </div>
        </div>
      </section>

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
}: {
  onOpen: (product: CatalogProduct) => void
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
        description="Эспрессо, фильтр и дрип-форматы. Нажмите на карточку, чтобы посмотреть характеристики, фасовку и цену."
      />
      <section className="coffee-section section-dark">
        <div className="product-grid">
          {coffeeProducts.map((product, index) => (
            <ProductCard
              product={product}
              index={index}
              onOpen={onOpen}
              key={product.id}
            />
          ))}
        </div>
      </section>
    </>
  )
}

function ChemistryView() {
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
        description="Профессиональная химия для ухода за кофейным оборудованием. Аксессуары для бара появятся в этом же разделе."
      />
      <section className="chemistry-section section-dark">
        <div className="chemistry-grid">
          {chemistryProducts.map((product, index) => (
            <article className="chemistry-card" key={product.code} data-reveal>
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
              <div className="chemistry-card__bottom">
                <span>{product.code}</span>
                <span>Данные уточняются</span>
              </div>
            </article>
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
}: {
  onOpen: (product: CatalogProduct) => void
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
                <button type="button" onClick={() => onOpen(product)}>
                  Подробнее
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
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
        <a className="button button--copper" href="#contacts">
          Обсудить обслуживание
          <ArrowRight size={18} />
        </a>
      </div>
    </section>
  )
}

function ContactsView({
  submitted,
  onSubmit,
}: {
  submitted: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
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

      <form className="contact-form" onSubmit={onSubmit} data-reveal>
        <label>
          <span>Имя</span>
          <input name="name" type="text" placeholder="Как к вам обращаться?" />
        </label>
        <label>
          <span>Телефон</span>
          <input name="phone" type="tel" placeholder="+7 (___) ___-__-__" />
        </label>
        <label>
          <span>Telegram / Email</span>
          <input
            name="contact"
            type="text"
            placeholder="@username или mail@example.ru"
          />
        </label>
        <label>
          <span>Комментарий</span>
          <textarea
            name="comment"
            rows={3}
            placeholder="Расскажите, что вам нужно"
          />
        </label>
        <button className="button button--dark button--wide" type="submit">
          Получить консультацию
          <ArrowUpRight size={18} />
        </button>
        {submitted ? (
          <p className="form-success">
            <Check size={17} />
            Демо-форма работает. Отправка будет подключена позже.
          </p>
        ) : (
          <p className="form-note">
            Пока это демонстрационная форма — данные никуда не отправляются.
          </p>
        )}
      </form>
    </section>
  )
}

function App() {
  const [selectedProduct, setSelectedProduct] =
    useState<CatalogProduct | null>(null)
  const [view, setView] = useState<View>(getViewFromHash())
  const [menuOpen, setMenuOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const handleHashChange = () => {
      setView(getViewFromHash())
      setMenuOpen(false)
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

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

      {view === 'home' && <HomeView onOpen={setSelectedProduct} />}
      {view === 'coffee' && <CoffeeView onOpen={setSelectedProduct} />}
      {(view === 'chemistry' || view === 'accessories') && <ChemistryView />}
      {view === 'equipment' && <EquipmentView onOpen={setSelectedProduct} />}
      {view === 'tea' && (
        <ComingSoonView
          eyebrow="Каталог · 03 / Чай"
          title="Чай"
          description="Готовим чайную карту для HoReCa: листовые сорта, купажи и форматы поставки. Оставьте заявку — сообщим, когда ассортимент появится на сайте."
          icon={<Leaf size={30} />}
        />
      )}
      {view === 'service' && <ServiceView />}
      {view === 'contacts' && (
        <ContactsView submitted={submitted} onSubmit={handleSubmit} />
      )}

      <footer className="site-footer">
        <div className="footer-brand">
          <BrandLogo footer />
          <p>Кофе, оборудование и сервис для заведений, которым важен стабильный вкус.</p>
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
        />
      )}
    </main>
  )
}

export default App
