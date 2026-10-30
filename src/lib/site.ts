export const phone = '+971 56 477 1478'
export const phoneLink = 'tel:+971564771478'
const whatsappBase = 'https://wa.me/971564771478'
export const whatsapp = `${whatsappBase}?text=Hi%20F%26T%20Auto%20Services%2C%20I%20need%20tyre%20or%20car%20repair%20assistance.`
export function whatsappLink(message: string): string {
  return `${whatsappBase}?text=${encodeURIComponent(message)}`
}
export const businessAddress = '3 Umm Suqeim St - Al Qouz Ind.third - Al Quoz - Dubai - United Arab Emirates'
export const businessEmail = 'fandttyres@gmail.com'
export const formSubmitEndpoint = `https://formsubmit.co/${businessEmail}`
export const formSubmitAjaxEndpoint = `https://formsubmit.co/ajax/${businessEmail}`
export const formSubmitConfig = {
  _subject: 'New website lead — F&T Auto Services',
  _template: 'table',
  lead_source: 'Callback form',
}
export const googleBusinessUrl = 'https://maps.app.goo.gl/KHyJ1AWd4SQjhiZS6'
export const googleMapsEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.4786034776644!2d55.213714499999995!3d25.116199400000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f69800acbeb4b%3A0x8e237ba522c88739!2sF%20%26%20T%20Auto%20Services.%20Tyres%20%7C%20Brakes%20%7C%20Mechanical%20%7C%20A%2FC%20%7C%20Wheel%20Alignment!5e1!3m2!1sen!2sin!4v1792744599835!5m2!1sen!2sin'
