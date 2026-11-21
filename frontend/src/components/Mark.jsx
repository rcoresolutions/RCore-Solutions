// The "R" mark from the RCore logo, drawn as SVG so it stays sharp at any size.
export default function Mark({ className = '', fill = 'currentColor' }) {
  return (
    <svg className={className} viewBox="360 275 500 405" aria-hidden="true" focusable="false">
      <path fill={fill} d="M366 281H695C780 281 843 335 843 408C843 475 790 520 716 527L852 675H722L512 445H697C725 445 747 430 747 408C747 385 725 366 697 366H440Z" />
      <path fill={fill} d="M401 445H474L685 675H572L505 597V675H411V470C411 460 407 452 401 445Z" />
    </svg>
  );
}
