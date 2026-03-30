import { getColorByProgress } from "@/helpers/strings/colors/get-color-by-progress"
import {
  soft_destructive,
  soft_warning,
  soft_success,
  soft_completed,
} from "@/lib/constants/global_constants"

describe('getColorByProgress', () => {
  // ─── Happy path: Normal progress values ────────────────────────────────────

  it('should return soft_destructive for progress 0-35', () => {
    expect(getColorByProgress(0)).toBe(soft_destructive)
    expect(getColorByProgress(20)).toBe(soft_destructive)
  })

  it('should return soft_warning for progress 36-60', () => {
    expect(getColorByProgress(36)).toBe(soft_warning)
    expect(getColorByProgress(45)).toBe(soft_warning)
  })

  it('should return soft_success for progress 61-90', () => {
    expect(getColorByProgress(61)).toBe(soft_success)
    expect(getColorByProgress(80)).toBe(soft_success)
  })

  it('should return soft_completed for progress 91-100', () => {
    expect(getColorByProgress(91)).toBe(soft_completed)
    expect(getColorByProgress(100)).toBe(soft_completed)
  })

  // ─── Edge cases: Threshold boundaries ──────────────────────────────────────

  it('should return soft_destructive at threshold 35', () => {
    expect(getColorByProgress(35)).toBe(soft_destructive)
  })

  it('should return soft_warning at threshold 60', () => {
    expect(getColorByProgress(60)).toBe(soft_warning)
  })

  it('should return soft_success at threshold 90', () => {
    expect(getColorByProgress(90)).toBe(soft_success)
  })

  it('should return soft_completed at max threshold 100', () => {
    expect(getColorByProgress(100)).toBe(soft_completed)
  })

  it('should return soft_warning just after destructive threshold', () => {
    expect(getColorByProgress(35.1)).toBe(soft_warning)
  })

  it('should return soft_success just after warning threshold', () => {
    expect(getColorByProgress(60.1)).toBe(soft_success)
  })

  it('should return soft_completed just after success threshold', () => {
    expect(getColorByProgress(90.1)).toBe(soft_completed)
  })

  // ─── Edge cases: Decimal values ─────────────────────────────────────────────

  it('should handle decimal progress values', () => {
    expect(getColorByProgress(25.5)).toBe(soft_destructive)
    expect(getColorByProgress(59.99)).toBe(soft_warning)
    expect(getColorByProgress(89.5)).toBe(soft_success)
  })

  // ─── Edge cases: Out of range ──────────────────────────────────────────────

  it('should return empty string for progress above 100', () => {
    expect(getColorByProgress(101)).toBe('')
    expect(getColorByProgress(150)).toBe('')
  })

  it('should return soft_destructive for negative progress (treated as <= 35)', () => {
    expect(getColorByProgress(-10)).toBe(soft_destructive)
    expect(getColorByProgress(-0.1)).toBe(soft_destructive)
  })
})
