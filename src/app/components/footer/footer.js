import styles from './Footer.module.css';
import Image from 'next/image';
import appStoreIcon from '@/assets/appStore.png';
import googlePlayIcon from '@/assets/googlePlay.png';
import twitterIcon from '@/assets/twitter.png';
import instagramIcon from '@/assets/instagram.png';
import facebookIcon from '@/assets/facebook.png';

const Footer = () => {
  return (
      <footer>
        <div className={styles.footerTop}>
          <div>
            <h1 className={styles.logo}>Trimpa</h1>
          </div>
          <ul>
            <h2 className={styles.footerHeading}>About</h2>
            <li className={styles.footerLi}>About Tripma</li>
            <li className={styles.footerLi}>How it works</li>
            <li className={styles.footerLi}>Careers</li>
            <li className={styles.footerLi}>Blog</li>
            <li className={styles.footerLi}>Press</li>
            <li className={styles.footerLi}>Forum</li>
          </ul>
          <ul>
            <h2 className={styles.footerHeading}>Partner with us</h2>
            <li className={styles.footerLi}>Partnership programs</li>
            <li className={styles.footerLi}>Affiliate program</li>
            <li className={styles.footerLi}>Connectivity partners</li>
            <li className={styles.footerLi}>Promotions and events</li>
            <li className={styles.footerLi}>Integrations</li>
            <li className={styles.footerLi}>Community</li>
            <li className={styles.footerLi}>Loyalty program</li>
          </ul>
          <ul>
            <h2 className={styles.footerHeading}>Support</h2>
            <li className={styles.footerLi}>Help Center</li>
            <li className={styles.footerLi}>Contact us</li>
            <li className={styles.footerLi}>Privacy policy</li>
            <li className={styles.footerLi}>Terms of service</li>
            <li className={styles.footerLi}>Trust and safety</li>
            <li className={styles.footerLi}>Accessibility</li>
          </ul>
          <ul>
            <h2 className={styles.footerHeading}>Get the app</h2>
            <li className={styles.footerLi}>Tripma for Android</li>
            <li className={styles.footerLi}>Tripma for iOS</li>
            <li className={styles.footerLi}>Mobile site</li>
            <Image className={styles.footerLi} src={appStoreIcon} alt="App Store" />
            <Image src={googlePlayIcon} alt="Google Play" />
          </ul>
        </div>
        <div className={styles.footerBottom}>
          <div className={styles.footerIcons}>
            <Image src={twitterIcon} alt="Twitter" />
            <Image src={instagramIcon} alt="Instagram" />
            <Image src={facebookIcon} alt="Facebook" />
          </div>
          <p className={styles.footerCopy}>&copy; 2020 Tripma incorporated</p>
        </div>
      </footer>
  );
};

export default Footer;
