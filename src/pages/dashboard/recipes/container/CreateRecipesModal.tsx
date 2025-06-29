import { useMutation } from '@tanstack/react-query';
import * as React from 'react';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';

import api from '@/lib/axios';
import useMutationToast from '@/hooks/toast/useMutationToast';

import Button from '@/components/buttons/Button';
import Input from '@/components/forms/Input';
import Radio from '@/components/forms/Radio';
import SearchableSelectInput from '@/components/forms/SearchableSelectInput';
import Modal from '@/components/modal/Modal';
import Typography from '@/components/typography/Typography';

import { RecipeCreateTypes } from '@/types/entity/recipes';

export const Category = [
  'Beef',
  'Chicken',
  'Seafood',
  'Vegetarian',
  'Pork',
  'Lamb',
  'Turkey',
  'Pasta',
  'Rice',
  'Soup',
  'Sandwiches',
  'Salads',
  'Pizza',
  'Desserts',
];

export const Origin = [
  'Asian',
  'MiddleEastern',
  'Indian',
  'African',
  'LatinAmerican',
  'Mediterranean',
  'Western',
  'SoutheastAsian',
  'EasternEuropean',
  'Scandinavian',
];

type ModalReturnType = {
  openModal: () => void;
};

export default function CreateRecipesModal({
  children,
}: {
  children: (props: ModalReturnType) => JSX.Element;
}) {
  const [open, setOpen] = React.useState(false);
  const modalReturn: ModalReturnType = {
    openModal: () => setOpen(true),
  };

  const methods = useForm({
    mode: 'onTouched',
  });

  const { handleSubmit } = methods;

  const { mutate: handleAdd, isLoading } = useMutationToast<
    void,
    RecipeCreateTypes
  >(
    useMutation(async (data) => {
      await api.post('/recipes/create', data);
      setOpen(false);
    })
  );

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const typedData = data as unknown as RecipeCreateTypes;

    const parsedData: RecipeCreateTypes = {
      ...typedData,
      cookTime: Number(typedData.cookTime),
      vegan: data.vegan === 'true',
    };

    handleAdd(parsedData);
  };

  return (
    <>
      {children(modalReturn)}
      <Modal
        open={open}
        setOpen={setOpen}
        title='Add New Recipe'
        className='z-[100]'
        modalContainerClassName='md:max-w-3xl'
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Section>
              <div className='flex flex-col gap-3'>
                <Input
                  id='name'
                  label='Name'
                  validation={{ required: 'Field must be filled' }}
                  placeholder='Enter your recipe name'
                  required
                />
                <Input
                  id='description'
                  label='Description'
                  validation={{ required: 'Field must be filled' }}
                  placeholder='Enter your recipe description'
                  required
                />
                <SearchableSelectInput
                  id='category'
                  label='Category'
                  placeholder='Select something'
                  options={Category.map((category) => ({
                    label: category,
                    value: category,
                  }))}
                  validation={{ required: 'Category must be filled' }}
                  required
                />
                <div className='space-y-2'>
                  <Typography variant='s2'>
                    Is Vegan? <span className='text-red-500'>*</span>
                  </Typography>
                  <div className='flex flex-row gap-4'>
                    <Radio name='vegan' label='Yes' value='true' hideError />
                    <Radio
                      name='vegan'
                      label='No'
                      value='false'
                      validation={{ required: 'Is Vegan must be filled' }}
                    />
                  </div>
                </div>
                <Input
                  id='cookTime'
                  type='number'
                  label='Cook Time'
                  validation={{ required: 'Field must be filled' }}
                  placeholder='Enter your recipe cook time'
                  required
                />
                <Input
                  id='thumbnail'
                  label='Thumbnail'
                  validation={{ required: 'Field must be filled' }}
                  placeholder='Enter your recipe thumbnail'
                  required
                />
                <SearchableSelectInput
                  id='origin'
                  label='Origin'
                  placeholder='Select something'
                  options={Origin.map((origin) => ({
                    label: origin,
                    value: origin,
                  }))}
                  validation={{ required: 'Origin must be filled' }}
                  required
                />

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='flex flex-col gap-2'>
                    <Typography variant='s3'>Ingredients</Typography>
                    {Array.from({ length: 10 }, (_, index) => (
                      <Input
                        key={`ingredient-${index}`}
                        id={`ingredient${index + 1}`}
                        label={`Ingredient ${index + 1}`}
                        placeholder='Enter ingredient'
                        required={index === 0}
                      />
                    ))}
                  </div>
                  <div className='flex flex-col gap-2'>
                    <Typography variant='s3'>Measures</Typography>
                    {Array.from({ length: 10 }, (_, index) => (
                      <Input
                        key={`measure-${index}`}
                        id={`measure${index + 1}`}
                        label={`Measure ${index + 1}`}
                        placeholder='Enter measure'
                        required={index === 0}
                      />
                    ))}
                  </div>
                  <div className='flex flex-col gap-2'>
                    <Typography variant='s3'>Steps</Typography>
                    {Array.from({ length: 10 }, (_, index) => (
                      <Input
                        key={`step-${index}`}
                        id={`step${index + 1}`}
                        label={`Step ${index + 1}`}
                        placeholder='Enter step'
                        required={index === 0}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Modal.Section>
            <Modal.Section>
              <div className='flex justify-end gap-2'>
                <Button variant='outline' onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type='submit' isLoading={isLoading}>
                  Submit
                </Button>
              </div>
            </Modal.Section>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
}
