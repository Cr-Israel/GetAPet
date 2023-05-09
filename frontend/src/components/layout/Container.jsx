import PropTypes from 'prop-types'

/* Styles */
import styles from './Container.module.css'

function Container ({ children }) {
  return <main className={styles.container}>{children}</main>
}

Container.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
}

export default Container
