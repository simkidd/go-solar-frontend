import { Metadata } from 'next';
import React from 'react';

const pageTitle = "Get a quote";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const QuotePage = () => {
  return (
    <div>QuotePage</div>
  )
}

export default QuotePage