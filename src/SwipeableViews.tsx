import React, { Children, useEffect, useMemo, useState } from "react";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export interface SwipeableViewsProps {
  activeIndex?: number;
  onSlideChange?: (index: number) => void;
  swiperInstance?: React.MutableRefObject<SwiperCore | undefined>;
  children: React.ReactElement<SwipeableViewProps>;
}

const SwipeableViews = ({
  children,
  activeIndex = 0,
  onSlideChange,
  swiperInstance,
}: SwipeableViewsProps) => {
  const lazySwiperChildren = useMemo(() => {
    return Children.map(children, (child, index) => {
      if (child) {
        const { children: tabContent, fallback } = child.props;
        if (fallback) {
          return (
            <SwiperSlide>
              <LazySlideComponent isActive={index === activeIndex} fallback={fallback}>
                {tabContent}
              </LazySlideComponent>
            </SwiperSlide>
          );
        } else {
          return <SwiperSlide>{child}</SwiperSlide>;
        }
      } else {
        return null;
      }
    });
  }, [children, activeIndex]);

  return (
    <Swiper
      className="react-swipeable-tab-views"
      touchReleaseOnEdges
      initialSlide={activeIndex}
      onSwiper={(swiper) => {
        if (swiperInstance) {
          swiperInstance.current = swiper;
        }
      }}
      onSlideChange={(swiper) => {
        onSlideChange?.(swiper.activeIndex);
      }}
    >
      {lazySwiperChildren}
    </Swiper>
  );
};

interface LazySlideComponentProps {
  isActive: boolean;
  fallback: React.ReactNode;
  children: React.ReactNode;
}

const LazySlideComponent: React.FC<LazySlideComponentProps> = ({
  isActive,
  children,
  fallback,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      setIsLoaded(isActive);
    }
  }, [isActive, isLoaded]);

  return <>{isLoaded ? children : fallback}</>;
};

export interface SwipeableViewProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

export const SwipeableView = ({ children, ...restProps }: SwipeableViewProps) => {
  return <div {...restProps}>{children}</div>;
};

export default SwipeableViews;
