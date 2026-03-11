'use client';

import SplitType from 'split-type';
import clsx from 'clsx';
import gsap from 'gsap';
import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import styles from './loader.module.scss';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import { useLoaderStore } from './store';

interface LoaderProps {
  /** Full name displayed during the loading intro */
  fullName?: string;
  /** Short name / tagline revealed after load */
  shortName?: string;
  /** ID of your layout wrapper element (used in the scale animation) */
  layoutId?: string;
}

function Loader({
  fullName = 'Gyanranjan Priyam',
  shortName = 'This is Priyam.',
  layoutId = 'layout',
}: LoaderProps) {
  const [lenis, introOut, setIntroOut, setIsLoading, setIsAbout] =
    useLoaderStore(
      useShallow((state) => [
        state.lenis,
        state.introOut,
        state.setIntroOut,
        state.setIsLoading,
        state.setIsAbout,
      ]),
    );

  const progressRef = useRef<HTMLHeadingElement>(null);
  const fullNameRef = useRef<HTMLHeadingElement>(null);
  const shortNameRef = useRef<HTMLHeadingElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    let ctx: gsap.Context | undefined;

    if (!introOut) {
      setIsAbout(pathname === '/about');

      ctx = gsap.context(() => {
        gsap.to(progressRef.current, {
          duration: 5,
          ease: 'power2.inOut',
          innerText: `${100}%`,
          roundProps: 'innerText',
          snap: {
            innerText: 1,
          },
          onComplete: () => {
            gsap.set('header', {
              autoAlpha: 0,
              ease: 'power2.inOut',
            });

            // Animate full name lines upward
            const splitted = new SplitType(fullNameRef.current!, {
              types: 'lines',
              tagName: 'span',
            });
            splitted.lines?.forEach((line) => {
              gsap.to(line, {
                ease: 'power4.inOut',
                top: '-12vw',
                duration: 1,
              });
            });

            // Reveal short name
            gsap.to(shortNameRef.current, {
              opacity: 1,
            });
            const splittedShort = new SplitType(shortNameRef.current!, {
              types: 'lines',
              tagName: 'span',
            });
            splittedShort.lines?.forEach((line) => {
              gsap.to(line, {
                ease: 'power4.inOut',
                top: '0px',
                duration: 1,
              });
            });

            // Animate progress number upward
            const splittedProgress = new SplitType(progressRef.current!, {
              types: 'lines',
              tagName: 'span',
            });
            splittedProgress.lines?.forEach((line) => {
              gsap.to(line, {
                ease: 'power4.inOut',
                top: '-12vw',
                duration: 1,
              });
            });

            lenis?.scrollTo(0, { force: true });

            gsap.set(document?.getElementById(layoutId), {
              height: '90%',
            });

            gsap.set('main', {
              x: '100%',
              scale: 0.9,
              opacity: 1,
              border: `2px solid ${getComputedStyle(document.documentElement).getPropertyValue('--white').trim()}`,
              borderRadius: '1.3888888889vw',
            });

            // Scale loader down
            gsap.to(root.current, {
              scale: 0.9,
              ease: 'power2.inOut',
              delay: 0.8,
              duration: 0.5,
              borderRadius: '1.3888888889vw',
            });

            // Slide loader out to the left
            gsap.to(root.current, {
              ease: 'power2.inOut',
              delay: 1.7,
              duration: 0.5,
              x: '-100%',
            });

            // Slide main content in
            gsap.to('main', {
              ease: 'power2.inOut',
              delay: 1.7,
              duration: 0.5,
              x: '0px',
            });

            // Scale main content back to full
            gsap.to('main', {
              ease: 'power2.inOut',
              delay: 2.2,
              duration: 0.5,
              scale: 1,
              borderRadius: 0,
            });

            gsap.to(document?.getElementById(layoutId), {
              ease: 'power2.inOut',
              delay: 2.2,
              duration: 0.5,
              height: '100%',
            });

            gsap.to('header', {
              delay: 2.3,
              duration: 0.5,
              ease: 'power2.inOut',
              autoAlpha: 1,
            });

            gsap.to('main', {
              ease: 'power2.inOut',
              delay: 2.7,
              height: 'auto',
              border: 'none',
              pointerEvents: 'auto',
              onComplete: () => {
                setIntroOut(true);
                setIsLoading(false);
                lenis?.start();
              },
            });
          },
        });
      });
    } else if (ctx) {
      ctx.kill();
    }

    return () => {
      if (ctx) {
        ctx.kill();
      }
    };
  }, [lenis, introOut]);

  return (
    <div
      id="loader"
      ref={root}
      className={clsx(styles.root, 'layout-block-inner')}
    >
      <div className={styles.innerContainer}>
        <div className={styles.fullNameContainer}>
          <h2
            ref={fullNameRef}
            className={clsx(styles.fullName, 'h2', 'name-text')}
          >
            {introOut ? (
              <>
                Loading
                <span className={styles.dots}>
                  <span className={styles.dot}>.</span>
                  <span className={styles.dot}>.</span>
                  <span className={styles.dot}>.</span>
                </span>
              </>
            ) : (
              fullName
            )}
          </h2>
        </div>

        {!introOut && (
          <div className={styles.shortNameContainer}>
            <h2
              ref={shortNameRef}
              className={clsx(styles.shortName, 'h2', 'name-text')}
            >
              {shortName}
            </h2>
          </div>
        )}

        {!introOut && (
          <div className={styles.progressContainer}>
            <h1
              ref={progressRef}
              className={clsx(styles.progress, 'h1', 'loader-number')}
            >
              0%
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default Loader;
