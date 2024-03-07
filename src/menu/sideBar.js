import './sideBar.css';

export function SideBar(props) {
  const { expanded } = props;

  const containerClasses = `sidebarContainer ${
    expanded ? 'expanded' : 'collapsed'
  }`;

  return <div className={containerClasses}></div>;
}
