// Informações comerciais — fonte única para cabeçalho, seção Visite, rodapé e SEO.
// Antes de publicar novos dados (horários, WhatsApp, link de cardápio), confirme com a casa.

const address = {
  street: 'Rua Mateus Leme, 1000',
  district: 'Centro Cívico',
  city: 'Curitiba',
  state: 'PR',
  postalCode: '80530-010',
};

const fullAddress = `${address.street} - ${address.district}, ${address.city} - ${address.state}, ${address.postalCode}`;

export const business = {
  name: 'Calabouço',
  legalName: 'Calabouço Restaurante e Pizzaria',
  tagline: 'Restaurante e Pizzaria',
  since: 1991,
  description: 'Restaurante à luz de velas, com pizzas, massas e vinhos em ambiente medieval.',
  address,
  fullAddress,
  phone: {
    display: '(41) 3254-6112',
    href: 'tel:+554132546112',
  },
  links: {
    instagram: 'https://www.instagram.com/calaboucorestaurante/',
    instagramHandle: '@calaboucorestaurante',
    // Pesquisa no Google Maps pelo nome e endereço completo (sem mapa incorporado).
    maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Calabouço Restaurante e Pizzaria, ${fullAddress}`)}`,
  },
} as const;

/** Âncoras das seções. Mantenha em sincronia com os `id` dos componentes. */
export const sectionIds = {
  top: 'inicio',
  flavors: 'sabores',
  experience: 'experiencia',
  house: 'a-casa',
  visit: 'visite',
} as const;

/** Navegação principal, na mesma ordem em que as seções aparecem na página. */
export const navigation = [
  { label: 'Sabores', href: `#${sectionIds.flavors}` },
  { label: 'Experiência', href: `#${sectionIds.experience}` },
  { label: 'A casa', href: `#${sectionIds.house}` },
  { label: 'Como chegar', href: `#${sectionIds.visit}` },
] as const;
