# Figma Current vs Previous Token Mapping

Source compare:
- Previous: [token/token.json](/Users/a39426/Desktop/v2-design-system-2026-refactor/token/token.json)
- Current: Figma local variables in file `skMLeeIF8mbzAT265CI8nP`

## Summary
- No token moved from one collection to another.
- `Theme` changed by value.
- `Primitive` changed by additions only.
- `Utility` changed by additions only.
- `Semantic` changed directly.

Collection counts:

| Collection | Previous | Current | Delta |
|---|---:|---:|---:|
| Theme | 45 | 45 | 0 |
| Typography | 56 | 56 | 0 |
| Primitive | 196 | 200 | +4 |
| Semantic | 154 | 162 | +8 |
| Utility | 22 | 43 | +21 |
| Misc | 76 | 76 | 0 |

## Safe Commit Read
Use this order to avoid breaking component-token references:

1. Land semantic rename mapping first.
2. Update all component, docs, and generated token references from `-alt` to `-alpha`.
3. Keep old semantic names out of removal scope until references are fully updated.
4. Land additive `Primitive` and `Utility` tokens in same commit if needed. They are non-breaking by themselves.
5. Review `Theme` radius changes for `CarInfo` before release because they can change component shape without any rename.

## Exact Mapping

### Semantic rename-only mapping
These are safe rename mappings. Underlying values stayed same.

| Previous | Current |
|---|---|
| `border/secondary-alt` | `border/secondary-alpha` |
| `border/secondary-alt-hover` | `border/secondary-alpha-hover` |
| `border/secondary-inverse-alt` | `border/secondary-inverse-alpha` |
| `border/secondary-inverse-alt-hover` | `border/secondary-inverse-alpha-hover` |
| `border/tertiary-alt` | `border/tertiary-alpha` |
| `border/tertiary-alt-hover` | `border/tertiary-alpha-hover` |

### Semantic new tokens
These are direct semantic additions, not upstream-only fallout.

- `bg/brand/bolder`
- `bg/brand/bolder-hover`
- `bg/brand/bolder-alt`
- `bg/brand/bolder-alt-hover`
- `border/primary-inverse`
- `border/primary-inverse-hover`
- `text/placeholder`
- `text/placeholder-inverse`
- `text/placeholder-subtle`

### Semantic removed without exact replacement
- `border/on-color`

Recommendation:
- Do not delete `border/on-color` in same commit unless you already know every component reference has been migrated or intentionally removed.

## Theme value changes
Same token names. Same collection. Real value changes in `CarInfo` mode.

| Token | Previous | Current |
|---|---:|---:|
| `radius/md` | 8 | 4 |
| `radius/lg` | 12 | 4 |
| `radius/xl` | 12 | 8 |
| `radius/xxl` | 20 | 8 |
| `radius/alt/md` | 8 | 4 |
| `radius/alt/lg` | 12 | 8 |
| `radius/alt/xl` | 12 | 8 |

Impact:
- This is component-shape risk, not naming risk.
- Anything consuming `CarInfo` theme radius tokens can render tighter corners after commit.

## Primitive additions
Additive only.

- `cool-mint/950`
- `drive-pink/950`
- `orange/950`
- `pop-purple/950`

## Utility additions
Additive only.

- `service/buy-car/base`
- `service/buy-car/bold`
- `service/buy-car/subtle`
- `service/car-check/base`
- `service/car-check/bold`
- `service/car-check/subtle`
- `service/challan/base`
- `service/challan/bold`
- `service/challan/subtle`
- `service/garage/base`
- `service/garage/bold`
- `service/garage/subtle`
- `service/insurance/base`
- `service/insurance/bold`
- `service/insurance/subtle`
- `service/loan/base`
- `service/loan/bold`
- `service/loan/subtle`
- `service/sell-car/base`
- `service/sell-car/bold`
- `service/sell-car/subtle`

## Commit Safety Checklist
- Update all references from the six `border/*-alt*` names to the mapped `border/*-alpha*` names.
- Do not treat `-alt -> -alpha` as a value change. Treat it as semantic rename-only.
- Keep `border/on-color` until replacement plan is explicit.
- Verify `CarInfo` radius consumers after token sync.
- Do not rename or move existing primitive, utility, theme collections in same commit.
