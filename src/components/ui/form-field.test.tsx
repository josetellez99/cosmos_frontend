import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormField } from './form-field'

// ─── Test setup ──────────────────────────────────────────────────────────────
//
// FormField requires a react-hook-form `control` object — it can only work
// inside a form. The pattern is to build a minimal wrapper that mirrors real
// usage (a form with a schema + submit button).
//
// We deliberately use a real useForm + zodResolver instead of mocking them:
// that's what the component is built for, and the tests should reflect it.

const schema = z.object({
    field: z.string().min(1, 'El campo es obligatorio'),
})
type TestSchema = z.infer<typeof schema>

interface TestWrapperProps {
    label?: string
    placeholder?: string
    type?: string
}

function TestWrapper({
    label = 'Correo electrónico',
    placeholder = 'test@test.com',
    type = 'text',
}: TestWrapperProps) {

    const { control, handleSubmit } = useForm<TestSchema>({
        resolver: zodResolver(schema),
        defaultValues: { field: '' },
    })

    return (
        <form onSubmit={handleSubmit(() => {})}>
            <FormField
                name="field"
                control={control}
                label={label}
                placeholder={placeholder}
                type={type}
            />
            <button type="submit">Enviar</button>
        </form>
    )
}

// ─── Rendering ───────────────────────────────────────────────────────────────

describe('FormField — rendering', () => {
    it('renders the label text', () => {
        render(<TestWrapper label="Correo electrónico" />)

        // The user sees the label — if this breaks, the field is unlabelled
        expect(screen.getByText('Correo electrónico')).toBeInTheDocument()
    })

    it('renders the input with the correct placeholder', () => {
        render(<TestWrapper placeholder="micorreo@dominio.com" />)

        expect(screen.getByPlaceholderText('micorreo@dominio.com')).toBeInTheDocument()
    })

    it('renders the input with the correct type', () => {
        render(<TestWrapper type="password" />)

        const input = screen.getByPlaceholderText('test@test.com')
        expect(input).toHaveAttribute('type', 'password')
    })

    it('connects the label to the input (accessibility)', () => {
        render(<TestWrapper label="Contraseña" />)

        // getByLabelText verifies the <label for> / <input id> relationship.
        // If this fails, the field is inaccessible to screen readers.
        const input = screen.getByLabelText('Contraseña')
        expect(input).toBeInTheDocument()
        expect(input.tagName).toBe('INPUT')
    })
})

// ─── Error state — conditional rendering ─────────────────────────────────────

describe('FormField — error state', () => {
    it('does not show an error message when the field is valid', () => {
        render(<TestWrapper />)

        // alert role is what FieldError renders when there is an error message
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('shows the error message when the field is submitted empty', async () => {
        const user = userEvent.setup()
        render(<TestWrapper />)

        // Submit without filling the field — triggers Zod validation
        await user.click(screen.getByRole('button', { name: /enviar/i }))

        // findBy* waits for the element to appear in the DOM
        const error = await screen.findByRole('alert')
        expect(error).toHaveTextContent('El campo es obligatorio')
    })

    it('hides the error message after the user fills the field correctly', async () => {
        const user = userEvent.setup()
        render(<TestWrapper />)

        // 1. Trigger the error
        await user.click(screen.getByRole('button', { name: /enviar/i }))
        expect(await screen.findByRole('alert')).toBeInTheDocument()

        // 2. User corrects the field
        await user.type(screen.getByLabelText('Correo electrónico'), 'valor válido')

        // 3. Error is gone
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
})

// ─── User interaction ─────────────────────────────────────────────────────────

describe('FormField — user interaction', () => {
    it('reflects typed text in the input value', async () => {
        const user = userEvent.setup()
        render(<TestWrapper />)

        const input = screen.getByLabelText('Correo electrónico')
        await user.type(input, 'hola@cosmos.com')

        expect(input).toHaveValue('hola@cosmos.com')
    })
})
