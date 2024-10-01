import React from 'react'
import styles from './banner.module.css'
import PropTypes from 'prop-types';

function Banner({ title, href, backgroundImage, customCss }) {
  return (
    <a
      href={href}
      style={{ backgroundImage: `url(${backgroundImage})` }} 
      className={`${styles.banner} ${styles[customCss]}`} 
    >
      <p  className={styles.title}>{title}</p>
    </a>
  )
}

Banner.propTypes = {
    title: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    backgroundImage: PropTypes.string.isRequired,
    customCss: PropTypes.string, 
};

export default Banner