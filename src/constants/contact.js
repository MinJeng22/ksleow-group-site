/**
 * contact.js — Company contact information
 * -----------------------------------------
 * Update these values to change contact details across the whole site.
 */

export const CONTACT = {
  address:   "No.8-9, Ground Floor, 1st Floor, 2nd Floor, Taman Zabidin, Kampung Catin, 28400 Mentakab, Pahang, Malaysia",
  email:     "support@ksleow.com.my",
  phone:     "017-905 2323",
  whatsapp:  "60179052323",
  facebook:  "https://www.facebook.com/ksleowbs",
  linkedin:  "",
  hours:     "9:00 AM – 6:00 PM (Mon – Fri)",
  weekend:   "Closed on Weekends",
};

export const WA_MSG = encodeURIComponent(
  "Hi, I would like to learn more about KSL Business Solutions. Thank you."
);

export const WA_LINK = `https://wa.me/${CONTACT.whatsapp}?text=${WA_MSG}`;
