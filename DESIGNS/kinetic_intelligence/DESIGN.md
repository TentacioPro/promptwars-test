---
name: Kinetic Intelligence
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#c7c4d8'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#918fa1'
  outline-variant: '#464555'
  surface-tint: '#c4c0ff'
  primary: '#c4c0ff'
  on-primary: '#2000a4'
  primary-container: '#8781ff'
  on-primary-container: '#1b0091'
  inverse-primary: '#4f44e2'
  secondary: '#c3c0ff'
  on-secondary: '#1c00a6'
  secondary-container: '#372cc5'
  on-secondary-container: '#b3b1ff'
  tertiary: '#ffb785'
  on-tertiary: '#502500'
  tertiary-container: '#db761f'
  on-tertiary-container: '#461f00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c4c0ff'
  on-primary-fixed: '#100069'
  on-primary-fixed-variant: '#3622ca'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#0e006a'
  on-secondary-fixed-variant: '#3529c2'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb785'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#713700'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  h1:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  subtitle:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  container-margin: 24px
  gutter: 20px
---

## Brand & Style

The design system is engineered for a high-performance, AI-driven environment where precision meets fluid collaboration. It targets technical teams and project leads who require a sophisticated, focused workspace that minimizes cognitive load while providing deep analytical insights.

The aesthetic blends **Minimalism** with **Glassmorphism**, utilizing a "Void" depth strategy. By using a deep navy foundation, the interface allows critical data points and AI-generated insights to emerge through glowing gradients and translucent layers. The emotional response is one of calm authority, futuristic reliability, and seamless technological integration.

## Colors

This design system utilizes a "Deep Space" palette to ensure maximum focus. The primary Indigo acts as the "action" color, reserved for interactive elements and AI state indicators. 

The background is a near-black navy to prevent pure-black eye strain while maintaining infinite contrast for white text. Semantic colors for success, warning, and error should be desaturated to fit the palette, ensuring they do not vibrate against the deep indigo background. Use the 10% white border opacity for all glass containers to define edges without adding visual weight.

## Typography

The typography system relies exclusively on **Inter** to maintain a systematic and utilitarian feel. High contrast is achieved by pairing pure white (#ffffff) for primary headings with a muted slate (#94a3b8) for subtitles and secondary metadata.

For long-form data or AI descriptions, use the `body-md` tier. Use `label-caps` for small tags or category headers to provide a structural rhythm that breaks up the vertical flow of information.

## Layout & Spacing

The layout utilizes a **12-column fluid grid** with generous 24px margins to allow the glassmorphic panels room to breathe. The spacing rhythm is based on a 4px baseline, with 24px (md) being the standard padding for cards and sections. 

Elements should be grouped using proximity rather than heavy dividers. Use `xl` spacing to separate major functional modules (e.g., the team dashboard from the skill matrix) to maintain a sense of organized "pods" of information.

## Elevation & Depth

Depth is communicated through **Glassmorphism** and backdrop effects rather than traditional shadows. 

1.  **Level 0 (Base):** Background (#0a0a14).
2.  **Level 1 (Panels):** 5% white background, 12px backdrop blur, 1px border (10% white).
3.  **Level 2 (Modals/Popovers):** 8% white background, 24px backdrop blur, 1px border (15% white).

To highlight AI-driven content, apply a subtle Indigo outer glow (low spread, high blur) to the container to signify "active intelligence."

## Shapes

The shape language is modern and approachable. A consistent **16px radius** is applied to all primary containers, panels, and input fields to soften the "tech" aesthetic. 

Buttons are slightly more compact with a **12px radius**, creating a subtle visual distinction between structural containers and actionable elements. Interaction states should never change the geometry of the shape, only the fill or border intensity.

## Components

### Buttons
*   **Primary:** Indigo gradient fill, white text. On hover, increase gradient brightness.
*   **Ghost:** Transparent fill, 1px border (10% white). On hover, change border to Primary Indigo and add a 5% indigo background tint.

### Input Fields
*   **Default:** Dark fill (5% white), 1px border (10% white), 16px radius. Text color is white, placeholder is #94a3b8.
*   **Focus:** Border transitions to Primary Indigo (#6c63ff) with a 2px outer glow.

### Cards & Panels
*   All cards utilize the glassmorphic stack (5% opacity, 12px blur).
*   Headers within cards should use the `subtitle` typography tier for a clear hierarchy.

### Chips & Tags
*   Small 4px rounded capsules. For skill tags, use a 10% Indigo tint with Indigo text for high legibility and brand alignment.

### Progress Bars (Skill Meters)
*   Track: 10% white background.
*   Indicator: Indigo gradient with a small glow at the leading edge to indicate movement or growth.