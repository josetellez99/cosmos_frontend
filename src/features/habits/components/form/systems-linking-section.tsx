import { useState, useMemo } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { FieldError } from "@/components/ui/field"
import { SystemItem } from "@/features/systems/components/system-item"
import { SystemSelectionModal } from "@/features/habits/components/form/system-selection-modal"
import { SystemLinkConfigModal } from "@/features/habits/components/form/system-link-config-modal"
import type { SystemSummaryResponse } from "@/features/systems/types/response/system-summary"
import type { HabitFormValues } from "@/features/habits/types/form/habit-form"

interface ConfigTarget {
    system: SystemSummaryResponse
    fieldIndex: number | null
}

export function SystemsLinkingSection() {
    const { control, formState } = useFormContext<HabitFormValues>()
    const { fields: systems, append, update, remove } = useFieldArray({ control, name: "systems" })

    const error = formState.errors.systems?.message as string | undefined

    const [configTarget, setConfigTarget] = useState<ConfigTarget | null>(null)
    const [linkedSystems, setLinkedSystems] = useState<Map<number, SystemSummaryResponse>>(new Map())

    const excludeIds = useMemo(
        () => new Set(systems.map(f => f.systemId)),
        [systems],
    )

    const handleSystemSelected = (system: SystemSummaryResponse) => {
        setConfigTarget({ system, fieldIndex: null })
    }

    const handleEditClick = (index: number) => {
        const field = systems[index]
        const system = linkedSystems.get(field.systemId)
        if (!system) return
        setConfigTarget({ system, fieldIndex: index })
    }

    const handleConfigConfirm = (weight: number, habitOrder: number) => {
        if (!configTarget) return

        const link = {
            systemId: configTarget.system.id,
            habitWeight: weight,
            habitOrder,
        }

        if (configTarget.fieldIndex !== null) {
            update(configTarget.fieldIndex, link)
        } else {
            append(link)
            setLinkedSystems(prev => new Map(prev).set(configTarget.system.id, configTarget.system))
        }

        setConfigTarget(null)
    }

    const handleRemove = (index: number) => {
        const field = systems[index]
        setLinkedSystems(prev => {
            const next = new Map(prev)
            next.delete(field.systemId)
            return next
        })
        remove(index)
    }

    return (
        <div className="flex flex-col gap-2">
            <ul className="flex flex-col gap-2">
                {systems.map((field, index) => {
                    const system = linkedSystems.get(field.systemId)
                    if (!system) return null
                    return (
                        <li key={field.id}>
                            <SystemItem
                                system={system}
                                showProgress={false}
                                onEditClick={() => handleEditClick(index)}
                                onRemoveClick={() => handleRemove(index)}
                                badge={
                                    <span className="text-xs font-bold text-primary px-2 py-1 rounded-md border border-primary/20 bg-primary/10">
                                        {field.habitWeight}%
                                    </span>
                                }
                            />
                        </li>
                    )
                })}
            </ul>

            <SystemSelectionModal
                excludeIds={excludeIds}
                onSystemSelect={handleSystemSelected}
            />

            <SystemLinkConfigModal
                systemId={configTarget?.system.id ?? null}
                isEditing={configTarget?.fieldIndex !== null}
                existingWeight={
                    configTarget !== null && configTarget.fieldIndex !== null
                        ? systems[configTarget.fieldIndex]?.habitWeight
                        : undefined
                }
                onClose={() => setConfigTarget(null)}
                onConfirm={handleConfigConfirm}
            />

            {error && <FieldError>{error}</FieldError>}
        </div>
    )
}
