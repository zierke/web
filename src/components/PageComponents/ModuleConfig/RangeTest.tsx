import type React from "react";
import { useEffect, useState } from "react";

import { Controller, useForm, useWatch } from "react-hook-form";

import { Input } from "@app/components/form/Input.js";
import { Toggle } from "@app/components/form/Toggle.js";
import { RangeTestValidation } from "@app/validation/moduleConfig/rangeTest.js";
import { Form } from "@components/form/Form";
import { useDevice } from "@core/providers/useDevice.js";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";

export const RangeTest = (): JSX.Element => {
  const { moduleConfig, connection } = useDevice();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    control,
  } = useForm<RangeTestValidation>({
    defaultValues: moduleConfig.rangeTest,
    resolver: classValidatorResolver(RangeTestValidation),
  });

  useEffect(() => {
    reset(moduleConfig.rangeTest);
  }, [reset, moduleConfig.rangeTest]);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    await connection?.setModuleConfig(
      {
        payloadVariant: {
          oneofKind: "rangeTest",
          rangeTest: data,
        },
      },
      async (): Promise<void> => {
        reset({ ...data });
        setLoading(false);
        await Promise.resolve();
      }
    );
  });

  const moduleEnabled = useWatch({
    control,
    name: "enabled",
    defaultValue: false,
  });

  return (
    <Form
      title="Range Test Config"
      breadcrumbs={["Module Config", "Range Test"]}
      reset={() => reset(moduleConfig.rangeTest)}
      loading={loading}
      dirty={isDirty}
      onSubmit={onSubmit}
    >
      <Controller
        name="enabled"
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
      <Input
        type="number"
        label="Message Interval"
        description="Max transmit power in dBm"
        disabled={!moduleEnabled}
        suffix="Seconds"
        {...register("sender", {
          valueAsNumber: true,
        })}
      />
      <Controller
        name="save"
        control={control}
        render={({ field: { value, ...rest } }) => (
          <Toggle
            label="Save CSV to storage"
            description="Description"
            checked={value}
            {...rest}
          />
        )}
      />
    </Form>
  );
};
