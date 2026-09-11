/**
 * Datos institucionales y de contacto.
 *
 * Un dato vacio no se renderiza: es preferible omitir un canal a publicar un
 * marcador de posicion. La version anterior mostraba "+593 XXX XXX XXX" en
 * produccion.
 */
export const EMPRESA = {
  nombre: 'SEOH DESIGN TECH S.A.',
  nombreCorto: 'SEOH',
  lema: 'Diseñamos soluciones. Construimos confianza.',
  dominio: 'seohdesigntech.com',
} as const;

type Contacto = {
  correo: string;
  telefono: string;
  whatsapp: string;
  ciudad: string;
};

export const CONTACTO: Contacto = {
  correo: 'info@seohdesigntech.com',
  /** Formato internacional sin espacios, p. ej. '+593987654321'. Vacio = no se muestra. */
  telefono: '+593998793588',
  /** Numero de WhatsApp en formato internacional sin '+'. Vacio = no se muestra. */
  whatsapp: '593998793588',
  ciudad: 'Ecuador',
};

/** Enlace `tel:` listo para usar, o null si aun no hay numero confirmado. */
export const enlaceTelefono = CONTACTO.telefono ? `tel:${CONTACTO.telefono}` : null;

/** Telefono formateado para lectura humana. */
export const telefonoLegible = CONTACTO.telefono
  ? CONTACTO.telefono.replace(/^(\+\d{3})(\d{2})(\d{3})(\d{4})$/, '$1 $2 $3 $4')
  : null;

export const enlaceWhatsapp = CONTACTO.whatsapp
  ? `https://wa.me/${CONTACTO.whatsapp}`
  : null;

/**
 * Datos registrales, para los documentos legales.
 *
 * La Ley Organica de Proteccion de Datos Personales exige identificar al
 * responsable del tratamiento. Un dato vacio se omite en la pagina en lugar de
 * publicarse a medias.
 */
export const REGISTRO = {
  /** RUC de la sociedad. */
  ruc: '',
  /** Domicilio fiscal completo: calle, numero, ciudad, provincia. */
  direccion: '',
};
