import { useEffect, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import {
  ArrowDown,
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

const categories = [
  {
    id: 'coffee',
    number: '01',
    name: 'Кофе',
    note: 'Пять характерных профилей',
    count: '5 позиций',
    description:
      'Эспрессо, фильтр и дрип-кофе с подтверждёнными профилями и актуальными вариантами фасовки.',
    href: '#coffee',
  },
  {
    id: 'tea',
    number: '02',
    name: 'Чай',
    note: 'Коллекция готовится',
    count: 'Скоро',
    description:
      'Раздел подготовлен для будущей коллекции листового чая и авторских купажей.',
    href: '#tea',
  },
  {
    id: 'accessories',
    number: '03',
    name: 'Аксессуары',
    note: 'Ассортимент готовится',
    count: 'Скоро',
    description:
      'Инструменты бариста, посуда и аксессуары для точного приготовления и подачи.',
    href: '#accessories',
  },
  {
    id: 'chemistry',
    number: '04',
    name: 'Химия',
    note: 'Профессиональный уход',
    count: '4 позиции',
    description:
      'Профессиональные средства для чистоты кофейных трактов, молочных систем и удаления накипи.',
    href: '#chemistry',
  },
]

function BrandLogo({ footer = false }: { footer?: boolean }) {
  return (
    <a
      className={`brand ${footer ? 'brand--footer' : ''}`}
      href="#top"
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

function App() {
  const [selectedProduct, setSelectedProduct] =
    useState<CatalogProduct | null>(null)
  const [activeCategory, setActiveCategory] = useState(categories[0].id)
  const [menuOpen, setMenuOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const selectedCategory =
    categories.find((category) => category.id === activeCategory) ?? categories[0]

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
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main>
      <header className="site-header">
        <BrandLogo />
        <nav className="desktop-nav" aria-label="Главная навигация">
          <a href="#production">Продукция</a>
          <a href="#equipment">Оборудование</a>
          <a href="#service">Сервис</a>
          <a href="#contacts">Контакты</a>
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

      <div className={`mobile-menu ${menuOpen ? 'is-open' : ''}`}>
        <nav aria-label="Мобильная навигация">
          <a href="#production" onClick={closeMenu}>
            Продукция <span>01</span>
          </a>
          <a href="#equipment" onClick={closeMenu}>
            Оборудование <span>02</span>
          </a>
          <a href="#service" onClick={closeMenu}>
            Сервис <span>03</span>
          </a>
          <a href="#contacts" onClick={closeMenu}>
            Контакты <span>04</span>
          </a>
        </nav>
      </div>

      <section className="hero-section" id="top">
        <div className="hero-section__shade" />
        <div className="hero-section__grain" />
        <div className="hero-section__content" data-reveal>
          <p className="hero-kicker">
            Specialty coffee · HoReCa · Service
          </p>
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
            <a className="button button--light" href="#coffee">
              Смотреть каталог
              <ArrowRight size={18} />
            </a>
            <a className="text-link" href="#service">
              Сервис оборудования
            </a>
          </div>
        </div>
        <div className="hero-side-note">
          <span>01</span>
          <p>От зерна до безупречной чашки</p>
        </div>
        <a className="scroll-cue" href="#production" aria-label="Листать ниже">
          <span>Scroll to explore</span>
          <ArrowDown size={17} />
        </a>
      </section>

      <section className="catalog-index section-dark" id="production">
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow">01 / Продукция</p>
            <h2>
              Всё для <em>идеальной</em> чашки
            </h2>
          </div>
          <p>
            Кофе собственной подборки, профессиональная химия и пространство
            для будущих коллекций.
          </p>
        </div>
        <div className="category-switcher" data-reveal>
          <div className="category-tabs" role="tablist" aria-label="Категории продукции">
            {categories.map((category) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === category.id}
                className={activeCategory === category.id ? 'is-active' : ''}
                onClick={() => setActiveCategory(category.id)}
                key={category.id}
              >
                <span>{category.number}</span>
                {category.name}
              </button>
            ))}
          </div>
          <div
            className="category-stage"
            data-category={selectedCategory.id}
            role="tabpanel"
          >
            <div className="category-stage__copy">
              <p className="eyebrow">{selectedCategory.note}</p>
              <h3>{selectedCategory.name}</h3>
              <p>{selectedCategory.description}</p>
              <a href={selectedCategory.href}>
                Открыть раздел
                <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="category-stage__visual" aria-hidden="true">
              <span className="category-stage__count">
                {selectedCategory.count}
              </span>
              <div className="category-orbit category-orbit--one" />
              <div className="category-orbit category-orbit--two" />
              <strong>{selectedCategory.number}</strong>
            </div>
          </div>
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

      <section className="coffee-section section-cream" id="coffee">
        <div className="section-heading section-heading--dark" data-reveal>
          <div>
            <p className="eyebrow">03 / Коллекция кофе</p>
            <h2>
              Пять разных
              <br />
              <em>характеров</em>
            </h2>
          </div>
          <p>
            Нажмите на карточку, чтобы посмотреть подтверждённые
            характеристики, варианты фасовки и актуальные цены.
          </p>
        </div>
        <div className="product-grid">
          {coffeeProducts.map((product, index) => (
            <ProductCard
              product={product}
              index={index}
              onOpen={setSelectedProduct}
              key={product.id}
            />
          ))}
        </div>
      </section>

      <section className="future-collections section-dark">
        <div className="future-card future-card--tea" id="tea" data-reveal>
          <div className="future-card__icon">
            <Coffee />
          </div>
          <div>
            <p className="eyebrow">Будущая коллекция / 01</p>
            <h2>Чай</h2>
            <p>
              Пространство подготовлено. Добавим сорта, происхождение и
              фотографии, когда будет сформирован ассортимент.
            </p>
          </div>
          <span className="future-card__status">Скоро</span>
        </div>
        <div
          className="future-card future-card--accessories"
          id="accessories"
          data-reveal
        >
          <div className="future-card__icon">
            <PackageOpen />
          </div>
          <div>
            <p className="eyebrow">Будущая коллекция / 02</p>
            <h2>Аксессуары</h2>
            <p>
              Здесь появятся инструменты и детали для приготовления и подачи
              кофе.
            </p>
          </div>
          <span className="future-card__status">Скоро</span>
        </div>
      </section>

      <section className="chemistry-section section-dark" id="chemistry">
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow">04 / Профессиональная химия</p>
            <h2>
              Чистота — часть
              <br />
              <em>вкуса</em>
            </h2>
          </div>
          <p>
            Средства для регулярного ухода за кофейным оборудованием. Фасовки и
            цены будут добавлены позже.
          </p>
        </div>
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

      <section className="equipment-section section-stone" id="equipment">
        <div className="section-heading section-heading--dark" data-reveal>
          <div>
            <p className="eyebrow">05 / Оборудование</p>
            <h2>
              Техника для
              <br />
              <em>стабильного результата</em>
            </h2>
          </div>
          <p>
            Проверенные решения для бара, кофейни и точки с высокой
            проходимостью.
          </p>
        </div>
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
                <button type="button" onClick={() => setSelectedProduct(product)}>
                  Подробнее
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="service-section" id="service">
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
          <p className="eyebrow">06 / Сервис оборудования</p>
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

      <section className="contact-section" id="contacts">
        <div className="contact-intro" data-reveal>
          <p className="eyebrow">07 / Контакты</p>
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

        <form className="contact-form" onSubmit={handleSubmit} data-reveal>
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

      <footer className="site-footer">
        <BrandLogo footer />
        <p>Кофе · Оборудование · Сервис</p>
        <a href="#top">
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
