import { useState, useMemo } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { FieldError } from "@/components/ui/field"
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
    const { fields, append, update, remove } = useFieldArray({ control, name: "systems" })

    const error = formState.errors.systems?.message as string | undefined

    const [configTarget, setConfigTarget] = useState<ConfigTarget | null>(null)
    const [linkedSystems, setLinkedSystems] = useState<Map<number, SystemSummaryResponse>>(new Map())

    const excludeIds = useMemo(
        () => new Set(fields.map(f => f.systemId)),
        [fields],
    )

    const handleSystemSelected = (system: SystemSummaryResponse) => {
        setConfigTarget({ system, fieldIndex: null })
    }

    const handleEditClick = (index: number) => {
        const field = fields[index]
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
        const field = fields[index]
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
                {fields.map((field, index) => {
                    const system = linkedSystems.get(field.systemId)
                    return (
                        <li key={field.id}>
                            <div className="default-card-rounded default-card-padding bg-white border border-soft-gray flex items-center justify-between gap-2">
                                <Typography variant="p">
                                    {system?.name ?? `Sistema #${field.systemId}`}
                                </Typography>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-bold text-primary px-2 py-1 rounded-md border border-primary/20 bg-primary/10">
                                        {field.habitWeight}%
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={() => handleEditClick(index)}
                                    >
                                        <Pencil />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={() => handleRemove(index)}
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            </div>
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
                        ? fields[configTarget.fieldIndex]?.habitWeight
                        : undefined
                }
                onClose={() => setConfigTarget(null)}
                onConfirm={handleConfigConfirm}
            />

            {error && <FieldError>{error}</FieldError>}
        </div>
    )
}
