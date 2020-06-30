export interface AppResponsiveStyles {
    /**
     * @see CSSStyleDeclaration: https://github.com/microsoft/TypeScript/blob/master/lib/lib.dom.d.ts#L2757
     */
    defaultScreenStyle?: Partial<CSSStyleDeclaration>;

    /**
     *  @see CSSStyleDeclaration: https://github.com/microsoft/TypeScript/blob/master/lib/lib.dom.d.ts#L2757
     */
    smallScreenStyle?: Partial<CSSStyleDeclaration>;

    /**
     *  @see CSSStyleDeclaration: https://github.com/microsoft/TypeScript/blob/master/lib/lib.dom.d.ts#L2757
     */
    largeScreenStyle?: Partial<CSSStyleDeclaration>;
}
