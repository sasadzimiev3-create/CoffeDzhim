export const siteContacts = {
  phone: '+79522839932',
  phoneHref: 'tel:+79522839932',
  phoneDisplay: '+7 952 283-99-32',
  email: 'dbr1994@yandex.ru',
  emailHref: 'mailto:dbr1994@yandex.ru',
}

export type SocialNetwork = 'telegram' | 'instagram' | 'whatsapp'

export type SocialLink = {
  id: SocialNetwork
  label: string
  href: string | null
}

export const siteSocials: SocialLink[] = [
  { id: 'telegram', label: 'Telegram', href: null },
  { id: 'instagram', label: 'Instagram', href: null },
  { id: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/79522839932' },
]
