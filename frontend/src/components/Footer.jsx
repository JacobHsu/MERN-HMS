import React from 'react'
import { assets } from '../assets/assets'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation(['navigation'])

  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm'>

        <div>
          <img className='mb-5 w-40' src={assets.logo} alt="" />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>{t('navigation:footer.description')}</p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>{t('navigation:footer.company')}</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>{t('navigation:footer.home')}</li>
            <li>{t('navigation:footer.aboutUs')}</li>
            <li>{t('navigation:footer.delivery')}</li>
            <li>{t('navigation:footer.privacyPolicy')}</li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>{t('navigation:footer.getInTouch')}</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+1-212-456-7890</li>
            <li>prescripto@gmail.com</li>
          </ul>
        </div>

      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>{t('navigation:footer.copyright')}</p>
      </div>

    </div>
  )
}

export default Footer
