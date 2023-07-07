import React from 'react';
import { render, screen } from '@testing-library/react';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { ApacheSpark } from '../../api/model';
import { ApacheSparkDriverLogs } from './ApacheSparkLogs';

jest.mock('@backstage/core-plugin-api');
jest.mock('react-use/lib/useAsync');

jest.mock('@backstage/core-components', () => ({
  LogViewer: (props: { text: string }) => {
    return <div>{props.text}</div>;
  },
}));

describe('ApacheSparkDriverLogs', () => {
  const mockUseApi = useApi as jest.MockedFunction<typeof useApi>;
  const mockUseAsync = useAsync as jest.MockedFunction<typeof useAsync>;
  const mockGetLogs = jest.fn();
  const mockSparkApp = {
    status: {
      driverInfo: {
        podName: 'test-pod',
      },
    },
  } as ApacheSpark;

  beforeEach(() => {
    mockUseApi.mockReturnValue({
      getLogs: mockGetLogs,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render error message if there is an error', () => {
    mockUseAsync.mockReturnValue({
      value: undefined,
      loading: false,
      error: new Error('Test error'),
    });

    render(<ApacheSparkDriverLogs sparkApp={mockSparkApp} />);
    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should render the log viewer with the fetched logs', async () => {
    mockUseAsync.mockReturnValue({
      value: 'test logs',
      loading: false,
      error: undefined,
    });
    render(<ApacheSparkDriverLogs sparkApp={mockSparkApp} />);
    expect(screen.getByText('test logs')).toBeInTheDocument();
  });
});
