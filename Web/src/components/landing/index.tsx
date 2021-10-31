import React from 'react';
import styled from 'styled-components/macro';
import HeaderContent from './HeaderContent';
import IntroductionContent from './IntroductionContent';
import DetailsContent from './DetailsContent';
import NavBar from './NavBar';
import { mdMin, lgMin } from '../../utils/media';
import { ReactComponent as PindaHappyBadgeSVG } from '../../svg/pinda-happy-badge.svg';
import { ReactComponent as PindaShockedBadgeSVG } from '../../svg/pinda-shocked-badge.svg';
import { ReactComponent as PindaHappySVG } from '../../svg/pinda-happy.svg';

const SectionStyle = `
  display: flex;
  justify-content: center;
  padding: 7rem 1rem;

  & > div {
    width: ${mdMin};

    @media (max-width: ${mdMin}) {
      width: calc(100% - 0.5em);
    }
  }
`;

const BadgeStyle = `
  height: 270px;

  @media (max-width: ${mdMin}) {
    height: 185px;
  }
`;

const LandingContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const TwoColumnDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  & > div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const HeaderSection = styled.section`
  ${SectionStyle}

  & > div {
    @media (max-width: ${mdMin}) {
      flex-direction: column-reverse;
    }
  }
`;

const IntroductionSection = styled.section`
  ${SectionStyle}
  background: var(--pale-yellow);
  clip-path: polygon(0 0, 100% 4rem, 100% calc(100% - 4rem), 0 100%);
  margin: -4rem 0;

  & > div {
    @media (max-width: ${mdMin}) {
      flex-direction: column;
    }
  }
`;

const DetailsSection = styled.section`
  ${SectionStyle}
  flex-direction: column;
  align-items: center;
  background: var(--pale-purple);

  @media (max-width: ${lgMin}) {
    padding-bottom: 0;
  }
`;

const PindaHappyBadge = styled(PindaHappyBadgeSVG)`
  ${BadgeStyle}
`;

const PindaShockedBadge = styled(PindaShockedBadgeSVG)`
  ${BadgeStyle}
`;

const PindaHappySide = styled(PindaHappySVG)`
  ${BadgeStyle}
  position: absolute;
  bottom: -30px;
  right: -50px;

  @media (max-width: ${lgMin}) {
    display: none;
  }
`;

const PindaHappyMid = styled(PindaHappySVG)`
  ${BadgeStyle}
  margin-top: 1em;
  display: none;
  transform: translateY(15px);

  @media (max-width: ${lgMin}) {
    display: block;
  }
`;

const LandingPage: React.FC = () => (
  <>
    <NavBar />
    <LandingContainer>
      <HeaderSection>
        <TwoColumnDiv>
          <HeaderContent />
          <PindaHappyBadge />
        </TwoColumnDiv>
      </HeaderSection>
      <IntroductionSection>
        <TwoColumnDiv>
          <PindaShockedBadge />
          <IntroductionContent />
        </TwoColumnDiv>
      </IntroductionSection>
      <DetailsSection>
        <DetailsContent />
        <PindaHappyMid />
      </DetailsSection>
      <PindaHappySide />
    </LandingContainer>
  </>
);

export default LandingPage;
