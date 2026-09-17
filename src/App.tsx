import { useEffect, useState } from 'react'
import type { CSSProperties, FormEvent, ReactNode } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Coffee,
  Droplets,
  Menu,
  PackageOpen,
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
  { id: 'chemistry', label: 'Химия' },
  { id: 'equipment', label: 'Оборудование' },
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
}[] = [
  {
    id: 'coffee',
    number: '01',
    name: 'Кофе',
    count: '5 позиций',
    available: true,
    description:
      'Эспрессо, фильтр и дрип-кофе с подтверждёнными профилями и актуальными вариантами фасовки.',
  },
  {
    id: 'chemistry',
    number: '02',
    name: 'Химия',
    count: '4 позиции',
    available: true,
    description:
      'Профессиональные средства для чистоты кофейных трактов, молочных систем и удаления накипи.',
  },
  {
    id: 'equipment',
    number: '03',
    name: 'Оборудование',
    count: '3 позиции',
    available: true,
    description:
      'Эспрессо-машины, автоматические темперы и суперавтоматы для бара и кофейни.',
  },
  {
    id: 'tea',
    number: '04',
    name: 'Чай',
    count: 'Скоро',
    available: false,
    description:
      'Раздел готовится под будущую коллекцию листового чая и авторских купажей.',
  },
  {
    id: 'accessories',
    number: '05',
    name: 'Аксессуары',
    count: 'Скоро',
    available: false,
    description:
      'Инструменты бариста, посуда и аксессуары для точного приготовления и подачи.',
  },
]

function getViewFromHash(): View {
  const hash = window.location.hash.replace('#', '') as View
  return views.includes(hash) ? hash : 'home'
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function BrandLogo({ footer = false }: { footer?: boolean }) {
  return (
    <a
      className={`brand ${footer ? 'brand--footer' : ''}`}
      href="#home"
      aria-label="CoffeDzhim.ru — на главную"
    >
      <span className="brand__mark">
        <span>C</span>
        <span>D</span>
      </span>
      <span className="brand__word">
        CoffeDzhim<small>.ru</small>
      </span>
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
    <header className={`site-header ${view !== 'home' ? 'site-header--solid' : ''}`}>
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
      <div className="page-hero__inner" data-reveal>
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
  return (
    <article
      className={`product-card product-card--${index + 1}`}
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
          <div className="product-card__index">0{index + 1}</div>
          <img src={product.image} alt={product.name} loading="lazy" />
          <span className="product-card__arrow">
            <ArrowUpRight size={20} />
          </span>
        </div>
        <div className="product-card__meta">
          <p className="eyebrow">{product.kind}</p>
          <h3>{product.name}</h3>
          <div className="product-card__footer">
            <span>{product.notes.join(' · ')}</span>
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
          className="product-modal__visual"
          style={{ '--card-accent': product.accent } as CSSProperties}
        >
          <p className="eyebrow">{product.kind}</p>
          <img src={product.image} alt={product.name} />
          <p className="product-modal__edition">Curated selection / 2026</p>
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

function HomeView() {
  return (
    <>
      <section className="hero-section" id="top">
        <div className="hero-section__shade" />
        <div className="hero-section__grain" />
        <div className="hero-section__content" data-reveal>
          <p className="hero-kicker">Specialty coffee · HoReCa · Service</p>
          <h1>
            Кофе.
            <br />
            Техника.
            <br />
            <em>Точность.</em>
          </h1>
          <p className="hero-copy">
            Премиальный кофе и оборудование для бизнеса, где важна каждая
            деталь.
          </p>
          <div className="hero-actions">
            <button
              className="button button--light"
              type="button"
              onClick={() => scrollToId('home-catalog')}
            >
              Смотреть каталог
              <ArrowRight size={18} />
            </button>
            <a className="text-link" href="#service">
              Сервис оборудования
            </a>
          </div>
        </div>
        <div className="hero-side-note">
          <span>01</span>
          <p>От зерна до безупречной чашки</p>
        </div>
        <button
          className="scroll-cue"
          type="button"
          onClick={() => scrollToId('home-catalog')}
          aria-label="Листать ниже"
        >
          <span>Scroll to explore</span>
          <ArrowDown size={17} />
        </button>
      </section>

      <section className="catalog-index section-dark" id="home-catalog">
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow">01 / Каталог</p>
            <h2>
              Выберите <em>категорию</em>
            </h2>
          </div>
          <p>
            Каждое направление — на отдельной странице. Кофе, профессиональная
            химия, оборудование и разделы, которые скоро пополнятся.
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
              <span className="category-nav__num">{category.number}</span>
              <div className="category-nav__body">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
              <div className="category-nav__meta">
                <span className="category-nav__count">{category.count}</span>
                <ArrowUpRight size={22} />
              </div>
            </a>
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
          <p className="eyebrow">02 / История</p>
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
        eyebrow="Каталог · 01 / Кофе"
        title={
          <>
            Пять разных
            <br />
            <em>характеров</em>
          </>
        }
        description="Нажмите на карточку, чтобы посмотреть подтверждённые характеристики, варианты фасовки и актуальные цены."
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
        eyebrow="Каталог · 02 / Химия"
        title={
          <>
            Чистота — часть
            <br />
            <em>вкуса</em>
          </>
        }
        description="Профессиональные средства для регулярного ухода за кофейным оборудованием. Фасовки и цены будут добавлены позже."
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
        eyebrow="Каталог · 03 / Оборудование"
        title={
          <>
            Техника для
            <br />
            <em>стабильного результата</em>
          </>
        }
        description="Проверенные решения для бара, кофейни и точки с высокой проходимостью."
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
        <div className="coming-soon__inner" data-reveal>
          <span className="coming-soon__icon">{icon}</span>
          <span className="coming-soon__status">Скоро</span>
          <p>{description}</p>
          <a className="button button--light" href="#contacts">
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
        <a className="page-back page-back--light" href="#home">
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
            <p>+7 (000) 000-00-00</p>
          </div>
          <div>
            <span>Email</span>
            <p>Ваш email</p>
          </div>
          <div>
            <span>Адрес</span>
            <p>Ваш город, ваш адрес</p>
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
        <button className="button button--light button--wide" type="submit">
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
    <main className={view !== 'home' ? 'main--inner' : ''}>
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

      {view === 'home' && <HomeView />}
      {view === 'coffee' && <CoffeeView onOpen={setSelectedProduct} />}
      {view === 'chemistry' && <ChemistryView />}
      {view === 'equipment' && <EquipmentView onOpen={setSelectedProduct} />}
      {view === 'tea' && (
        <ComingSoonView
          eyebrow="Каталог · 04 / Чай"
          title="Чай"
          description="Пространство подготовлено. Добавим сорта, происхождение и фотографии, когда будет сформирован ассортимент листового чая и авторских купажей."
          icon={<Coffee size={30} />}
        />
      )}
      {view === 'accessories' && (
        <ComingSoonView
          eyebrow="Каталог · 05 / Аксессуары"
          title="Аксессуары"
          description="Здесь появятся инструменты бариста, посуда и детали для точного приготовления и подачи кофе."
          icon={<PackageOpen size={30} />}
        />
      )}
      {view === 'service' && <ServiceView />}
      {view === 'contacts' && (
        <ContactsView submitted={submitted} onSubmit={handleSubmit} />
      )}

      <footer className="site-footer">
        <BrandLogo footer />
        <p>Кофе · Оборудование · Сервис</p>
        <a href="#home">
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

      <div className="floating-mark" aria-hidden="true">
        <Droplets size={14} />
        local preview
      </div>
    </main>
  )
}

export default App
