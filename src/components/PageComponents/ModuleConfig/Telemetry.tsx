import type React from "react";
import { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";

import { Input } from "@app/components/form/Input.js";
import { Toggle } from "@app/components/form/Toggle.js";
import { TelemetryValidation } from "@app/validation/moduleConfig/telemetry.js";
import { Form } from "@components/form/Form";
import { useDevice } from "@core/providers/useDevice.js";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";

export const Telemetry = (): JSX.Element => {
  const { moduleConfig, connection } = useDevice();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    control,
  } = useForm<TelemetryValidation>({
    defaultValues: moduleConfig.telemetry,
    resolver: classValidatorResolver(TelemetryValidation),
  });

  useEffect(() => {
    reset(moduleConfig.telemetry);
  }, [reset, moduleConfig.telemetry]);

  const onSubmit = handleSubmit((data) => {
    setLoading(true);
    void connection?.setModuleConfig(
      {
        payloadVariant: {
          oneofKind: "telemetry",
          telemetry: data,
        },
      },
      async () => {
        reset({ ...data });
        setLoading(false);
        await Promise.resolve();
      }
    );
  });
  return (
    <Form
      title="Telemetry Config"
      breadcrumbs={["Module Config", "Telemetry"]}
      reset={() => reset(moduleConfig.telemetry)}
      loading={loading}
      dirty={isDirty}
      onSubmit={onSubmit}
    >
      <Controller
        name="environmentMeasurementEnabled"
        control={control}
        render={({ field: { value, ...rest } }) => (
          <Toggle
            label="Module Enabled"
            description="Description"
            checked={value}
            {...rest}
          />
        )}
      />
      <Controller
        name="environmentScreenEnabled"
        control={control}
        render={({ field: { value, ...rest } }) => (
          <Toggle
            label="Displayed on Screen"
            description="Description"
            checked={value}
            {...rest}
          />
        )}
      />
      <Input
        label="Update Interval"
        description="Max transmit power in dBm"
        suffix="Seconds"
        type="number"
        {...register("environmentUpdateInterval", {
          valueAsNumber: true,
        })}
      />
      <Controller
        name="environmentDisplayFahrenheit"
        control={control}
        render={({ field: { value, ...rest } }) => (
          <Toggle
            label="Display Farenheit"
            description="Description"
            checked={value}
            {...rest}
          />
        )}
      />
    </Form>
  );
};
