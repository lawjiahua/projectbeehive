import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header'; // Assuming you have a Header component

const BeehivePage: React.FC = () => {
  let { name } = useParams<{ name: string }>();

  return (
    <div>
      <Header username={"jiahua"} avatarSrc={"../../public/logo512.png"} />
      <h2>{name}</h2>
      {/* Additional beehive details can be added here */}
    </div>
  );
};

export default BeehivePage;
