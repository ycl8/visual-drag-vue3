export default function getIconPath(iconName) {
    try {
      return import(`../../assets/icon/${iconName}.svg`);
    } catch (error) {
      console.error(`Failed to load icon: ${iconName}`, error);
      return null;
    }
  }