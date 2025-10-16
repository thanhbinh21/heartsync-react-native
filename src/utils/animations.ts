import { Animated, Easing } from 'react-native';

export class AnimationUtils {
  // Smooth fade in animation
  static fadeIn(animatedValue: Animated.Value, duration: number = 300): Animated.CompositeAnimation {
    return Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
  }

  // Smooth fade out animation
  static fadeOut(animatedValue: Animated.Value, duration: number = 300): Animated.CompositeAnimation {
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    });
  }

  // Scale bounce animation
  static scaleBounce(animatedValue: Animated.Value, toValue: number = 1): Animated.CompositeAnimation {
    return Animated.spring(animatedValue, {
      toValue,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    });
  }

  // Slide in from bottom
  static slideInFromBottom(animatedValue: Animated.Value, duration: number = 400): Animated.CompositeAnimation {
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    });
  }

  // Slide out to bottom
  static slideOutToBottom(animatedValue: Animated.Value, toValue: number, duration: number = 300): Animated.CompositeAnimation {
    return Animated.timing(animatedValue, {
      toValue,
      duration,
      easing: Easing.in(Easing.back(1.2)),
      useNativeDriver: true,
    });
  }

  // Pulse animation
  static pulse(animatedValue: Animated.Value, minValue: number = 0.8, maxValue: number = 1.2): Animated.CompositeAnimation {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: maxValue,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: minValue,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
  }

  // Heart beat animation
  static heartBeat(animatedValue: Animated.Value): Animated.CompositeAnimation {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.3,
          duration: 150,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 150,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1.1,
          duration: 100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 100,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(1000),
      ])
    );
  }

  // Swipe card animations
  static swipeRight(
    translateX: Animated.Value,
    rotate: Animated.Value,
    screenWidth: number,
    duration: number = 250
  ): Animated.CompositeAnimation {
    return Animated.parallel([
      Animated.timing(translateX, {
        toValue: screenWidth * 1.5,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: 0.3,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);
  }

  static swipeLeft(
    translateX: Animated.Value,
    rotate: Animated.Value,
    screenWidth: number,
    duration: number = 250
  ): Animated.CompositeAnimation {
    return Animated.parallel([
      Animated.timing(translateX, {
        toValue: -screenWidth * 1.5,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: -0.3,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);
  }

  static swipeUp(
    translateY: Animated.Value,
    scale: Animated.Value,
    screenHeight: number,
    duration: number = 300
  ): Animated.CompositeAnimation {
    return Animated.parallel([
      Animated.timing(translateY, {
        toValue: -screenHeight,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);
  }

  // Return to center animation
  static returnToCenter(
    translateX: Animated.Value,
    translateY: Animated.Value,
    rotate: Animated.Value,
    scale?: Animated.Value
  ): Animated.CompositeAnimation {
    const animations = [
      Animated.spring(translateX, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(rotate, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ];

    if (scale) {
      animations.push(
        Animated.spring(scale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      );
    }

    return Animated.parallel(animations);
  }

  // Stagger animation for multiple items
  static stagger(
    animations: Animated.CompositeAnimation[],
    staggerDelay: number = 100
  ): Animated.CompositeAnimation {
    return Animated.stagger(staggerDelay, animations);
  }

  // Match celebration animation
  static matchCelebration(): {
    scale: Animated.Value;
    rotate: Animated.Value;
    opacity: Animated.Value;
    animation: Animated.CompositeAnimation;
  } {
    const scale = new Animated.Value(0);
    const rotate = new Animated.Value(0);
    const opacity = new Animated.Value(0);

    const animation = Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1.2,
          tension: 100,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotate, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 150,
        friction: 8,
        useNativeDriver: true,
      }),
    ]);

    return { scale, rotate, opacity, animation };
  }

  // Typing indicator animation
  static typingIndicator(animatedValues: Animated.Value[]): Animated.CompositeAnimation {
    const animations = animatedValues.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 200),
          Animated.timing(value, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0.3,
            duration: 400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      )
    );

    return Animated.parallel(animations);
  }
}